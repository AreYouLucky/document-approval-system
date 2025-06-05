<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentRevision extends Model
{
    protected $table = 'document_revisions';
    protected $primaryKey = 'revision_id';
    protected $fillable = [
        'document_id',
        'document_dir',
        'process_type',
        'process_owner',
        'version_no',
        'initiator',
        'reasons',
        'date_prepared',
        'progress_status',
        'date_prepared',
        'progress_status',
        'file_type',
        'title',
        'document_type',
        'supporting_documents',
        'effectivity_date',
        'retention_period',
        'is_new_version',
        'pdf_dir',
        'email',
        'is_qmr'
    ];


    public function audit_logs()
    {
        return $this->hasMany(AuditLog::class, 'revision_id'); 
    }
}
