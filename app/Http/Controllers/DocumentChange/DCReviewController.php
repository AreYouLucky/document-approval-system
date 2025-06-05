<?php

namespace App\Http\Controllers\DocumentChange;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Document;
use App\Models\DocumentRevision;
use Illuminate\Support\Facades\DB;
use App\Models\AuditComment;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail;
use App\Mail\UpdateMail;
use App\Models\UserAction;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Carbon;
use Smalot\PdfParser\Parser;

class DCReviewController extends Controller
{

    public function documentListCount()
    {
        $counts = DB::table('document_revisions')
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->select('progress_status', DB::raw('count(*) as total'))
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->groupBy('progress_status')
            ->get();


        $initial_review = 0;
        $final_review = 0;
        $approved = 0;

        foreach ($counts as $row) {
            switch ($row->progress_status) {
                case 0:
                    $initial_review += $row->total;
                    break;
                case 5:
                    $final_review += $row->total;
                    break;
                case 7:
                    $approved += $row->total;
                    break;
            }
        }
        $data = [
            'initial_review' => $initial_review,
            'final_review' => $final_review,
            'approved' => $approved,
        ];
        return $data;
    }

    public function initialReview($id)
    {
        if (Auth::guard('hris')->user()) {
            return Inertia::render('DocumentChange/Dc/DcInitialReview');
        } else {
            return Inertia::render(('Auth/LoginDc'));
        }
    }

    public function reviewDocument($id)
    {
        return Inertia::render('DocumentChange/Dc/DcInitialReview');
    }

    public function getDocumentDetails(string $id)
    {
        if (!is_numeric($id)) {
            $decrypted_id = Crypt::decrypt($id);
        } else {
            $decrypted_id = $id;
        }
        $remarks = AuditLog::select('remarks')->where('document_id', $decrypted_id)->latest()->first();
        $latestRevisionId = AuditComment::where('document_id', $decrypted_id)
            ->max('revision_id');

        $comments = AuditComment::where('document_id', $decrypted_id)
            ->where('revision_id', $latestRevisionId)
            ->get();
        $document = Document::where('is_final', 0)
            ->where('document_id', $decrypted_id)
            ->with('latestRevision')
            ->orderBy('created_at')
            ->first();
        return response()->json([
            'remarks' => $remarks,
            'comments' => $comments,
            'document' => $document,
        ]);
    }

    public function loadInitialReview()
    {
        return DocumentRevision::where('progress_status', 0)
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->get();
    }

    public function loadFinalReview()
    {
        return DocumentRevision::where('progress_status', 5)
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->get();
    }
    public function loadApprovedDocuments()
    {
        return DocumentRevision::join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->whereNot('document_revisions.process_type', 3)
            ->whereRaw('document_revisions.revision_id = (
            SELECT MAX(dr.revision_id)
            FROM document_revisions dr
            WHERE dr.document_id = document_revisions.document_id and dr.progress_status = 7
        )')
            ->get();
    }

    public function postInitialReview(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = Auth::user();

            $document_revision = DocumentRevision::find($request->revision_id);
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $file->storeAs('/iso_documents', $request->document_dir, 'public');
            }

            if ($request->is_qmr == 1) {
                $name = 'Top management';
                $email = env('tm_email');
            } else {
                $name = 'QMR';
                $email = env('qmr_email');
            }

            if (!$document_revision) {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'Document revision not found.',
                ], 404);
            }
            if ($request->status == 1) {
                $status = 'Approved(redirect to qmr)';
                $document_revision->progress_status = 2;
                $msg = "Your document change request for \"" . $request->title . "\", Revision No. " . $request->last_revision_no . ", has been initially reviewed and approved by the QMS Document Custodian. Please await the review by the " . $name . ".";
            } else if ($request->status == 2) {
                $status = 'For Revision(redirect back to process owner)';
                $document_revision->progress_status = 1;
                $msg = "Your document change request for \"" . $request->title . "\", Revision No. " . $request->last_revision_no . ", requires revisions based on the initial review by the QMS Document Custodian. Please make the necessary changes in the QMS Portal.";
            } else {
                $msg = "Your document change request for \"" . $request->title . "\", Revision No. " . $request->last_revision_no . ", has been reviewed and rejected by the QMS Document Custodian. Please check the documents logs in the qms portal for further details.";
                $status = 'Rejected(redirect back to process owner)';
                $document_revision->progress_status = 3;
            }

            $document_revision->save();

            $audit_logs = new AuditLog();
            $audit_logs->user_id = $user->id;
            $audit_logs->reviewer = $user->full_name;
            $audit_logs->remarks = $request->remarks ?? '';
            $audit_logs->revision_id = $request->revision_id;
            $audit_logs->document_id = $request->document_id;
            $audit_logs->status = $document_revision->progress_status;
            $audit_logs->audit_date = now();
            $audit_logs->save();


            if ($request->file_type == 1) {
                $comments = json_decode($request->input('comments', '[]'), true);
                AuditComment::where('revision_id', $request->revision_id)
                    ->delete();
                if (!empty($comments) && is_array($comments)) {
                    foreach ($comments as $comment) {
                        AuditComment::create([
                            'user_id' => $user->id,
                            'reviewer' => $comment['author'],
                            'comments' => $comment['comments'],
                            'revision_id' => $request->revision_id,
                            'document_id' => $request->document_id,
                            'comment_date' => now(),
                            'audit_logs_id' => $audit_logs->id,
                            'is_resolved' => $comment['is_resolved'] == false ? 0 : 1
                        ]);
                    }
                }
            } else {
                $comments = json_decode($request->input('comments', '[]'), true);
                if (is_array($comments)) {
                    foreach ($comments as $comment) {
                        if (empty($comment['comment_date'])) {
                            AuditComment::create([
                                'user_id' => $user->id,
                                'reviewer' => $user->full_name,
                                'comments' => $comment['comments'],
                                'location' => $comment['location'],
                                'revision_id' => $request->revision_id,
                                'document_id' => $request->document_id,
                                'comment_date' => $comment['date'],
                                'audit_logs_id' => $audit_logs->id
                            ]);
                        }
                    }
                }
            }
            UserAction::create([
                'action_maker' => $user->id,
                'action_made' => 'Document Custodian audited document id ' . $request->document_id . ' on revision ' . $request->revision_id . 'status: ' . $status,
                'affected_user' => 0
            ]);

            if ($request->status == 1) {
                $encryptedId = base64_encode($request->document_id);
                $encrypted = Crypt::encrypt($request->document_id);
                $details = [
                    'name' => 'STII Quality Management Representative',
                    'message' => "
                    I hope this email finds you well.  
                    I am reaching out to request your review of " . $request->title . " , Revision No. " . $request->last_revision_no . ". This is already reviewed by yours truly. Use this code to access the document: ",
                    'sender' => $user->full_name,
                    'position' => 'Document Custodian,  ' . $user->position,
                    'code' => $encryptedId,
                    'link' => 'http://127.0.0.1:8000/qmr/review-document/' . $encrypted . '/' . $request->is_qmr
                ];

                $subject = $request->title . ' - QMS Document Review';
                Mail::to($email)->send(new SendMail($details, $subject));
            }

            $details = [
                'message' => $msg
            ];
            Mail::to($request->email)->send(new UpdateMail($details));

            DB::commit();

            return response()->json([
                'status' => 'Success',
                'message' => 'Document saved successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'failed',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function finalReview()
    {
        if (Auth::user()) {
            return Inertia::render('DocumentChange/Dc/DcFinalReview');
        } else {
            return Inertia::render(('Auth/FinalLoginDc'));
        }
    }

    public function FinalreviewDocument($id)
    {
        return Inertia::render('DocumentChange/Dc/DcFinalReview');
    }

    public function getFinalReviewDocumentDetails(string $id)
    {
        if (!is_numeric($id)) {
            $decrypted_id = Crypt::decrypt($id);
        } else {
            $decrypted_id = $id;
        }

        $remarks = AuditLog::select('remarks')->where('document_id', $decrypted_id)->latest()->first();
        $latestRevisionId = AuditComment::where('document_id', $decrypted_id)
            ->max('revision_id');

        $comments = AuditComment::where('document_id', $decrypted_id)
            ->where('revision_id', $latestRevisionId)
            ->get();
        $document = Document::where('is_final', 0)
            ->where('document_id', $decrypted_id)
            ->with('latestRevision')
            ->orderBy('created_at')
            ->first();
        return response()->json([
            'remarks' => $remarks,
            'comments' => $comments,
            'document' => $document,
        ]);
    }

    public function saveAsPdf(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:doc,docx,xlsx|max:2048',
            'filename' => 'required|string',
            'version' => 'required|string',
        ]);

        try {
            $file = $request->file('file');
            $file->storeAs('/iso_documents', $request->filename, 'public');
            $wordPath = storage_path('app/public/iso_documents/' . $request->filename);
            $pdfDirectory = storage_path('app/public/iso_documents/');
            $libreOfficePath = env('libre_office_path');

            // Escape paths
            $libreOfficePath = escapeshellarg($libreOfficePath);

            $command = "$libreOfficePath --headless --convert-to pdf --outdir $pdfDirectory $wordPath";


            shell_exec($command);
            $originalNameWithoutExtension = pathinfo($request->filename, PATHINFO_FILENAME);
            $convertedPdfPath = $pdfDirectory . $originalNameWithoutExtension . '.pdf';
            $newPdfFileName = $originalNameWithoutExtension . '_' . $request->version . '.pdf';
            $newPdfPath = $pdfDirectory . $newPdfFileName;
            if (file_exists($convertedPdfPath)) {
                rename($convertedPdfPath, $newPdfPath);
            } else {
                throw new \Exception('PDF conversion failed: Output file not found.');
            }

            $parser = new Parser();
            $pdf = $parser->parseFile(storage_path('app/public/iso_documents/' . $newPdfFileName));
            $text = $pdf->getText();

            Document::where('document_id', $request->document_id)
                ->update([
                    'text_conversion' => $text,
                ]);


            return response()->json([
                'status' => 'Success!',
                'pdf_file' => asset('storage/iso_documents/' . $newPdfFileName),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'failed',
                'message' => $e->getMessage(),
            ], 422);
        }
    }


    public function reuploadPdf(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:2048'
        ]);

        try {

            $file = $request->file('file');
            $file->storeAs('/iso_documents', $request->file_name, 'public');

            return response()->json([
                'status' => 'Successfully saved pdf'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'failed',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
    public function submitFinalReview(Request $request)
    {
        $user = Auth::guard('hris')->user();
        $file = $request->file('file');
        $file->storeAs('/iso_documents', $request->filename, 'public');
        DocumentRevision::where('revision_id', $request->revision_id)
            ->update([
                'pdf_dir' => $request->pdf_name,
                'progress_status' => 7
            ]);

        $msg = "Your document change request for \"" . $request->document_name . "\", Revision No. " . $request->last_revision_no . ", has been approved and is posted in the QMS Portal. ";
        $details = [
            'message' => $msg
        ];
        Mail::to($request->email)->send(new UpdateMail($details));

        UserAction::create([
            'action_maker' => $user->id,
            'action_made' => 'Document Custodian created final review on ' . $request->document_name,
            'affected_user' => 0
        ]);
        return response()->json([
            'status' => 'Status successfully updated'
        ]);
    }
}
