<?php

namespace App\Http\Controllers\DocumentChange;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Document;
use Illuminate\Support\Facades\Crypt;
use App\Models\UserAction;
use App\Models\DocumentRevision;
use Illuminate\Support\Facades\DB;
use App\Models\AuditComment;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail;
use App\Mail\UpdateMail;

class QMRReviewController extends Controller
{

    public function documentListCount()
    {
        $user = Auth::guard('hris')->user();
        $is_qmr = 0;
        if ($user->qms_role == 'Top Management') {
            $is_qmr = 1;
        }
        $counts = DB::table('document_revisions')
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->select('progress_status', DB::raw('count(*) as total'))
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->where('is_qmr', $is_qmr)
            ->groupBy('progress_status')
            ->get();


        $for_review = 0;
        $approved = 0;

        foreach ($counts as $row) {
            switch ($row->progress_status) {
                case 2:
                    $for_review += $row->total;
                    break;
                case 7:
                    $approved += $row->total;
                    break;
            }
        }
        $data = [
            'for_review' => $for_review,
            'approved' => $approved,
        ];
        return $data;
    }

    public function ViewQMRReview(String $id , string $type)
    {
        try {
            $decrypted = Crypt::decrypt($id);
            $status = Document::where('document_id', $decrypted)->first();
            if ($status) {
                $credentials = [
                    'username' => $type == '0' ? env('qmr_user') : env('tm_user'),
                    'password' => $type == '0' ? env('qmr_pass') : env('tm_pass'),
                ];

                if (Auth::guard('hris')->attempt($credentials)) {
                    if (Auth::guard('hris')->user()) {
                        return Inertia::render('Auth/LoginCode');
                    }
                    return abort(402);
                };
            }
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => $e->getMessage()
                ]
            );
        }
    }

    public function validateQmrCode(Request $req)
    {
        $req->validate([
            'code' => 'required'
        ]);

        $decrypted_id = base64_decode($req->code);
        $status = Document::where('document_id', $decrypted_id)->first();

        if ($status) {
            return response()->json(
                [
                    'status' => 'sucess'
                ]
            );
        }

        return response()->json(
            [
                'logs' => 'Validation Failed'
            ],
            402
        );
    }

    public function reviewDocument($id)
    {
        return Inertia::render('DocumentChange/QMR/QMRReview');
    }

    public function getDocumentDetails(string $id)
    {
        if (!is_numeric($id)) {
            $decrypted_id = base64_decode($id);
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


    public function postQMRReview(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = Auth::guard('hris')->user();
            $document_revision = DocumentRevision::find($request->revision_id);
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $file->storeAs('/iso_documents', $request->document_dir, 'public');
            }


            if ($request->is_qmr == 1) {
                $name = 'Top management';
            } else {
                $name = 'QMR';
            }
            if ($request->status == 1) {
                $status = 'Approved(redirect to final review)';
                $document_revision->progress_status = 5;
                $document_revision->effectivity_date = now();
                $document_revision->is_new_version = 1;
                $document_revision->version_no = $document_revision->version_no + 1;
                $msg = "Your document change request for \"" . $request->title . "\", Revision No. " . $request->last_revision_no . ", has been reviewed and approved by the " . $name . ". Please wait for Document Custodian to update the status of your request.";
            } else if ($request->status == 2) {
                $status = 'For Revision(redirect back to process owner)';
                $document_revision->progress_status = 4;
                $msg = "Your document change request for \"" . $request->title . "\", Revision No. " . $request->last_revision_no . ", requires revisions based on the review by the " . $name . ". Please make the necessary changes in the QMS Portal.";
            } else {
                $status = 'Rejected(redirect back to process owner)';
                $document_revision->progress_status = 6;
                $msg = "Your document change request for \"" . $request->title . "\", Revision No. " . $request->last_revision_no . ", has been reviewed and rejected by the " . $name . ". Please check the documents logs in the qms portal for further details.";
            }
            $document_revision->save();

            $audit_logs = new AuditLog();
            $audit_logs->user_id = $user->id;
            $audit_logs->reviewer = $user->full_name;
            $audit_logs->remarks = $request->remarks ?? 'No remarks provided';
            $audit_logs->revision_id = $request->revision_id;
            $audit_logs->document_id = $request->document_id;
            $audit_logs->status = $document_revision->progress_status;
            $audit_logs->audit_date = now();
            $audit_logs->save();

            if ($request->file_type == 1) {
                $comments = json_decode($request->input('comments', '[]'), true);
                if (!empty($comments) && is_array($comments)) {
                    foreach ($comments as $comment) {
                        if (empty($comment['comment_date'])) {
                            AuditComment::create([
                                'user_id' => $user->id,
                                'reviewer' => $user->full_name,
                                'comments' => $comment,
                                'revision_id' => $request->revision_id,
                                'document_id' => $request->document_id,
                                'comment_date' => now(),
                                'audit_logs_id' => $audit_logs->id,
                            ]);
                        }
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
                'action_made' => 'QMR audited document id ' . $request->document_id . ' on revision ' . $request->revision_id . 'status: ' . $status,
                'affected_user' => 0
            ]);
            if ($request->status == 1) {
                $encryptedId = Crypt::encrypt($request->document_id);
                $details = [
                    'name' => 'STII Document Custodian',
                    'message' => "
                        I have reviewed and verified all the details of the document titled \"{$request->title},\"  
                        Revision No. {$request->last_revision_no}. It is now ready for your final review before being  
                        published as a PDF file and a new version of the document.
                    ",
                    'sender' => $user->full_name,
                    'position' => $user->position,
                    'link' => url('/dc/final-review-document/' . $encryptedId)
                ];

                $subject = $request->title . ' - QMS Document Final Review';
                $email1 = env('dc_email1');
                $email2 = env('dc_email2');
                Mail::to([$email1, $email2])->send(new SendMail($details, $subject));
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

    public function loadForReviewDocuments()
    {
        return DocumentRevision::where('progress_status', 2)
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->get();
    }

    public function loadApprovedDocuments()
    {
        return DocumentRevision::select('document_revisions.*')
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->whereNot('document_revisions.process_type', 3)
            ->whereRaw('document_revisions.revision_id = (
            SELECT MAX(dr.revision_id)
            FROM document_revisions dr
            WHERE dr.document_id = document_revisions.document_id and dr.progress_status = 7
        )')
            ->get();
    }
}
