<?php

namespace App\Http\Controllers\DocumentChange;

use App\Http\Controllers\Controller;
use App\Models\DocumentRevision;
use Illuminate\Support\Facades\Auth;
use App\Models\Document;

class PDFVersionViewerController extends Controller
{
    public function getDocumentVersions($id)
    {
        $document = Document::select('code')->where('document_id', $id)->first();
        $user = Auth::user();
        if ($user->qms_role == 'Process Owner') {
            $versions = DocumentRevision::select('revision_id','process_owner', 'version_no', 'title', 'pdf_dir', 'reasons', 'effectivity_date', 'document_type')
                ->where('document_id', $id)
                ->where('process_owner', $user->full_name)
                ->where('progress_status', 7)
                ->orderBy('revision_id', 'desc')
                ->get();
        } else {
            $versions = DocumentRevision::select('revision_id','process_owner', 'title', 'version_no', 'pdf_dir', 'reasons', 'effectivity_date', 'document_type')
                ->where('document_id', $id)
                ->where('progress_status', 7)
                ->orderBy('revision_id', 'desc')
                ->get();
        }

        return response()->json([
            'code' => $document->code,
            'versions' => $versions
        ]);
    }

    public function getDocument($id)
    {
        $document = Document::select('code')->where('document_id', $id)->first();
        return response()->json([
            'code' => $document->code,
        ]);
    }
    public function getDocumentVersionHistory(String $document_id, String $revision_id)
    {
        $revisions = DocumentRevision::where('revision_id', '<=', $revision_id)
            ->where('document_id', $document_id)
            ->orderBy('revision_id', 'desc')
            ->with(['audit_logs.audit_logs_comment'])
            ->get();

        $parse_data = [];
        $index = 0;

        foreach ($revisions as $revision) {
            if ($index == 0 || $revision->progress_status !== 7) {
                $parse_data[] = $revision;
            } else {
                break;
            }

            $index++;
        }

        return response()->json([
            'revisions' => $parse_data
        ]);
    }
}
