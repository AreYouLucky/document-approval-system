<?php

namespace App\Http\Controllers\DocumentChange;

use App\Http\Controllers\Controller;
use App\Models\AuditComment;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DocumentRevision;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\UserAction;
use Illuminate\Support\Facades\Crypt;
use App\Mail\SendMail;
use Illuminate\Support\Facades\Mail;

class ProcessOwnerController extends Controller
{
    public function documentListCount()
    {
        $counts = DB::table('document_revisions')
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->select('progress_status', DB::raw('count(*) as total'))
            ->where('document_revisions.process_owner', Auth::user()->full_name)
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
            ->where('process_owner', Auth::user()->full_name)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->get();
    }

    public function loadForRevisionDocuments()
    {
        return DocumentRevision::whereIn('progress_status', [1, 4])
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->where('process_owner', Auth::user()->full_name)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->get();
    }

    public function loadApprovedDocuments()
    {
        return DocumentRevision::join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
        ->where('process_owner', Auth::user()->full_name)
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
            ->where('process_owner', Auth::user()->full_name)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->get();
    }

    public function viewReviseDocument(String $id)
    {
        return Inertia::render('DocumentChange/ProcessOwner/ReviseDocument');
    }

    public function getReviseDocument(String $id)
    {
        $remarks = AuditLog::select('remarks', 'id')->where('revision_id', $id)->latest()->first();
        $comments = AuditComment::where('revision_id', $id)->get();
        $document = DocumentRevision::where('revision_id', $id)
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->where('process_owner', Auth::user()->full_name)
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
            $user = Auth::user();
            $revision = DocumentRevision::create([
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

            $details = [
                'name' => 'STII Document Custodian',
                'message' => "

                I hope this email finds you well.  

                I am reaching out to request your review of " . $request->title . " , Revision No. " . $request->version . " .
                ",
                'sender' => $user->full_name,
                'position' => $user->position,
                'link' => 'http://127.0.0.1:8000/dc/review-document/' . $encryptedId
            ];


            Mail::to('johncagadas29@gmail.com')->send(new SendMail($details));


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
