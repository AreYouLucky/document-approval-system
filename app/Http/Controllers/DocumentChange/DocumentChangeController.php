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


class DocumentChangeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('DocumentChange/Public/SubmitDocumentChange');
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

            $user = Auth::user();
            DB::beginTransaction();

            $division_chief =  User::select('id')->where('division', $user->division)->where('qms_role', 'Division Chief')->first();
            $qmr =  User::select('id')->where('qms_role', 'QMR')->first();

            $document = Document::firstOrNew(['code' => $request->code, 'division' => $user->division]);
            $document->save();

            $revision = DocumentRevision::create([
                'email' => $user->email,
                'document_id' => $document->document_id,
                'document_dir' => $filename,
                'process_type' => $request->process_type,
                'process_owner' => $user->full_name,
                'version_no' => $request->version,
                'initiator' => $user->full_name,
                'reasons' => $request->reasons,
                'date_prepared' => now(),
                'division_chief_id' => $division_chief->id,
                'qmr_id' => $qmr->id,
                'file_type' => $file_type,
                'title' => $request->title,
                'document_type' => $request->document_type,
                'supporting_documents' => $request->supporting_documents,
            ]);

            UserAction::create([
                'action_maker' => Auth::user()->id,
                'action_made' => 'uploaded document entitled ' . $request->title,
                'affected_user' => 0
            ]);

            // $audit_logs = new AuditLog();
            // $audit_logs->user_id = Auth::id();
            // $audit_logs->remarks = 'Submitted new document change request';
            // $audit_logs->revision_id = $revision->revision_id;
            // $audit_logs->document_id = $document->document_id;
            // $audit_logs->status = 0;
            // $audit_logs->audit_date = now();
            // $audit_logs->save();



            $encryptedId = Crypt::encrypt($document->document_id);

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


            Mail::to(['johncagadas29@gmail.com', 'johnmichaelcagadas@gmail.com'])->send(new SendMail($details));


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

    public function loadPendingDocuments()
    {
        if (Auth::user()->qms_role == 'Super Admin') {
            return Document::where('is_final', 0)
                ->with('latestRevision')
                ->orderBy('created_at')
                ->get();
        }
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
        return DocumentRevision::select('document_type','code','title','process_owner','version_no','effectivity_date')
            ->where('progress_status', 7)
            ->join('documents', 'document_revisions.document_id', '=', 'documents.document_id')
            ->whereNot('process_type', 3)
            ->whereRaw('document_revisions.revision_id = (SELECT MAX(revision_id) FROM document_revisions WHERE document_id = documents.document_id)')
            ->orderBy('document_type','desc')
            ->get();
    }
}
