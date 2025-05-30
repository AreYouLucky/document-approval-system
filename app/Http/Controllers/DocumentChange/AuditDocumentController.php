<?php

namespace App\Http\Controllers\DocumentChange;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Document;
use App\Models\DocumentRevision;

class AuditDocumentController extends Controller
{
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $request;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('DocumentChange/AuditDocuments');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Document::where('is_final', 0)
                ->where('document_id',$id)
                ->with('latestRevision')
                ->orderBy('created_at')
                ->first();
    }

    public function auditDocument(String $id, String $audit_type){
        DocumentRevision::where('document_id',$id)
        ->update([
            'status' => $audit_type
        ])->latest();

        return response()->json([
            'status' => 'Document Successfully Approved !'
        ]);
    } 
}
