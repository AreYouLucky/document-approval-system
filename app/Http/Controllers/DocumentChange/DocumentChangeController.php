<?php

namespace App\Http\Controllers\DocumentChange;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Document;
use App\Models\DocumentRevision;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserAction;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail;
use App\Models\AuditLog;
use App\Models\AuditComment;

class DocumentChangeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('DocumentChange/All/SubmitDocumentChange');
    }
    public function store(Request $request)
    {
        $request->validate([
            'process_type' => 'required |numeric|max:100',
            'code' => 'required |string|max:100',
            'title' => 'required |string|max:255',
            'version' => 'required |numeric|max:50',
            'reasons' => 'required |string|max:255',
            'file' => 'required|mimes:xlsx,xls,doc,docx|max:2048',
            'supporting_documents' => 'string| nullable'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $extension = $file->getClientOriginalExtension();
            $fileType = '.' . $extension;
            $code = preg_replace('/[^A-Za-z0-9]/', '_', $request->code);
            $title = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);

            $filename = $code . '_' . $title . $fileType;
            $file->storeAs('/iso_documents', $filename, 'public');
        }


        if ($extension == 'docx' || $extension == 'doc') {
            $file_type = 1;
        } else {
            $file_type = 2;
        }



        try {

            $user = Auth::guard('hris')->user();
            DB::beginTransaction();

            $document = Document::firstOrNew(['code' => $request->code, 'division' => $user->division_id,  'section' => $user->section_id]);
            $document->save();

            $is_qmr = 0;
            if ($user->qms_role == 'QMR') {
                $is_qmr = 1;
            }

            DocumentRevision::create([
                'email' => $user->email,
                'document_id' => $document->document_id,
                'document_dir' => $filename,
                'process_type' => $request->process_type,
                'process_owner' => $user->full_name,
                'version_no' => $request->version,
                'initiator' => $user->full_name,
                'reasons' => $request->reasons,
                'date_prepared' => now(),
                'file_type' => $file_type,
                'title' => $request->title,
                'document_type' => $request->document_type,
                'supporting_documents' => $request->supporting_documents,
                'is_qmr' => $is_qmr
            ]);

            UserAction::create([
                'action_maker' => Auth::user()->id,
                'action_made' => 'uploaded document entitled ' . $request->title,
                'affected_user' => 0
            ]);
            $site_url = env('site_url');

            $encryptedId = Crypt::encrypt($document->document_id);
            $details = [
                'name' => 'STII Document Custodian',
                'message' => "

                I hope this email finds you well.  

                I am reaching out to request your review of " . $request->title . " , Revision No. " . $request->version . " .
                ",
                'sender' => $user->full_name,
                'position' => $user->position,
                'link' => $site_url.'dc/review-document/' . $encryptedId
            ];

            $subject = $request->title . ' - QMS Document Initial Review';
            $email1 = env('dc_email1');
            $email2 = env('dc_email2');
            Mail::to([$email1, $email2])->send(new SendMail($details, $subject));


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


        return response()->json(['message' => 'File upload failed'], 400);
    }


    public function getDocument(String $id)
    {
        if (Auth::user()->qms_role == 'Process Owner') {
            return DocumentRevision::where('revision_id', $id)
                ->where('process_owner', Auth::user()->full_name)
                ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
                ->first();
        }
        return DocumentRevision::where('revision_id', $id)
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->first();
    }

    public function getDocumentTimeline(String $id)
    {
        if (Auth::user()->qms_role == 'Process Owner') {
            return DocumentRevision::where('document_id', $id)
                ->where('process_owner', Auth::user()->full_name)
                ->with([
                    'audit_logs' => function ($query) {
                        $query->with('audit_logs_comment');
                    }
                ])
                ->orderBy('document_revisions.revision_id', 'desc')
                ->get();
        }
        return DocumentRevision::where('document_id', $id)
            ->with([
                'audit_logs' => function ($query) {
                    $query->with('audit_logs_comment');
                }
            ])
            ->orderBy('document_revisions.revision_id', 'desc')
            ->get();
    }

    public function getDocumentByCode(String $code)
    {
        $processOwner = Auth::user()->full_name;

        return DB::table('documents')
            ->join(DB::raw('
                (
                    SELECT dr1.*
                    FROM document_revisions dr1
                    INNER JOIN (
                        SELECT document_id, MAX(created_at) AS latest
                        FROM document_revisions
                        GROUP BY document_id
                    ) dr2 ON dr1.document_id = dr2.document_id AND dr1.created_at = dr2.latest
                ) AS document_revisions
            '), 'documents.document_id', '=', 'document_revisions.document_id')
            ->select(
                'document_revisions.title',
                'document_revisions.document_dir',
                'document_revisions.file_type',
                'document_revisions.document_dir',
                'document_revisions.version_no',
                'document_revisions.supporting_documents',
                'document_revisions.document_type'

            )
            ->where('documents.code', $code)
            ->where('document_revisions.process_owner', $processOwner)
            ->first();
    }

    public function loadDocumentsReport()
    {
        return DocumentRevision::select('document_type', 'code', 'title', 'process_owner', 'version_no', 'effectivity_date')
            ->where('progress_status', 7)
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->whereNot('process_type', 3)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->orderBy('document_type', 'desc')
            ->get();
    }

    public function loadDocuments()
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


    public function viewPdf(String $id)
    {
        return Inertia::render('Public/ViewDocumentPdf');
    }

    public function documentListCount()
    {
        $counts = DB::table('document_revisions')
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->select('progress_status', DB::raw('count(*) as total'))
            ->where('document_revisions.process_owner', Auth::guard('hris')->user()->full_name)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->groupBy('progress_status')
            ->get();

        // Initialize counters
        $pending = 0;
        $forrevision = 0;
        $approved = 0;
        $rejected = 0;

        foreach ($counts as $row) {
            switch ($row->progress_status) {
                case 0:
                case 2:
                case 5:
                    $pending += $row->total;
                    break;
                case 1:
                case 4:
                    $forrevision += $row->total;
                    break;
                case 7:
                    $approved += $row->total;
                    break;
                case 3:
                case 6:
                    $rejected += $row->total;
                    break;
            }
        }
        $data = [
            'pending' => $pending,
            'forrevision' => $forrevision,
            'approved' => $approved,
            'rejected' => $rejected,
        ];
        return $data;
    }


    public function loadPendingDocuments()
    {
        return DocumentRevision::whereIn('progress_status', [0, 2, 5])
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->where('process_owner', Auth::guard('hris')->user()->full_name)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->get();
    }

    public function loadForRevisionDocuments()
    {
        return DocumentRevision::whereIn('progress_status', [1, 4])
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->where('process_owner', Auth::guard('hris')->user()->full_name)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->get();
    }

    public function loadApprovedDocuments()
    {
        return DocumentRevision::join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->where('process_owner', Auth::guard('hris')->user()->full_name)
            ->whereNot('document_revisions.process_type', 3)
            ->whereRaw('document_revisions.revision_id = (
            SELECT MAX(dr.revision_id)
            FROM document_revisions dr
            WHERE dr.document_id = documents.document_id and dr.progress_status = 7
        )')
            ->get();
    }

    public function loadRejectedDocuments()
    {
        return DocumentRevision::whereIn('progress_status', [3, 6])
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->where('process_owner', Auth::guard('hris')->user()->full_name)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->get();
    }

    public function viewReviseDocument(String $id)
    {
        return Inertia::render('DocumentChange/All/ReviseDocument');
    }

    public function getReviseDocument(String $id)
    {
        $remarks = AuditLog::select('remarks', 'id')->where('revision_id', $id)->latest()->first();
        $comments = AuditComment::where('revision_id', $id)->get();
        $document = DocumentRevision::where('revision_id', $id)
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->where('process_owner', Auth::guard('hris')->user()->full_name)
            ->whereIn('progress_status', [1, 4])
            ->first();
        return response()->json([
            'remarks' => $remarks,
            'comments' => $comments,
            'document' => $document,
        ]);
    }

    public function submitDocumentRevision(Request $request)
    {
        $request->validate([
            'process_type' => 'required |numeric|max:100',
            'title' => 'required |string|max:255',
            'version' => 'required |numeric|max:50',
            'reasons' => 'required |string|max:255',
            'file' => 'required|mimes:xlsx,xls,doc,docx|max:2048',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $extension = $file->getClientOriginalExtension();
            $filename = $request->document_dir;
            $file->storeAs('/iso_documents', $filename, 'public');
        }
        if ($extension == 'docx' || $extension == 'doc') {
            $file_type = 1;
        } else {
            $file_type = 2;
        }
        try {
            DB::beginTransaction();
            $user = Auth::guard('hris')->user();


            $is_qmr = 0;
            if ($user->qms_role == 'QMR') {
                $is_qmr = 1;
            }

            DocumentRevision::create([
                'email' => $user->email,
                'document_id' => $request->document_id,
                'document_type' => $request->document_type,
                'document_dir' => $filename,
                'process_type' => $request->process_type,
                'process_owner' => $user->full_name,
                'version_no' => $request->version,
                'initiator' => $user->full_name,
                'reasons' => $request->reasons,
                'date_prepared' => now(),
                'division_chief_id' => $request->division_chief_id,
                'qmr_id' => $request->qmr_id,
                'file_type' => $file_type,
                'title' => $request->title,
                'is_qmr' => $is_qmr,
                'supporting_documents' => $request->supporting_documents,
            ]);

            UserAction::create([
                'action_maker' => $user->id,
                'action_made' => 'uploaded revision on document entitled ' . $request->title,
                'affected_user' => 0
            ]);



            if ($file_type == 1) {
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
                            'audit_logs_id' => $request->audit_log,
                            'is_resolved' => $comment['is_resolved'] == false ? 0 : 1
                        ]);
                    }
                }
            }
            if ($file_type == 2) {
                $comments = json_decode($request->input('comments', '[]'), true);
                if (is_array($comments)) {
                    foreach ($comments as $comment) {
                        AuditComment::where('id', $comment['id'])->update([
                            'is_resolved' => $comment['is_resolved'],
                        ]);
                    }
                }
            }


            $encryptedId = Crypt::encrypt($request->document_id);
            $site_url = env('site_url');

            $details = [
                'name' => 'STII Document Custodian',
                'message' => "

                I hope this email finds you well.  

                I am reaching out to request your review of " . $request->title . " , Revision No. " . $request->version . " .
                ",
                'sender' => $user->full_name,
                'position' => $user->position,
                'link' => $site_url.'dc/review-document/' . $encryptedId
            ];


            $subject = $request->title . ' - Revision Applied';
            $email1 = env('dc_email1');
            $email2 = env('dc_email2');
            Mail::to([$email1, $email2])->send(new SendMail($details, $subject));


            DB::commit();
            return response()->json([
                'status' => 'Success',
                'message' => 'Document revisions saved successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'failed',
                'message' => $e->getMessage(),
            ], 422);
        }


        return response()->json(['message' => 'File upload failed'], 400);
    }
}
