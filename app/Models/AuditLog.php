<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'remarks',
        'revision_id',
        'document_id',
        'status',
        'audit_date',
        'reviewer',

    ];

    public function audit_logs_comment()
    {
        return $this->hasMany(AuditComment::class,'audit_logs_id','id'); 
    }
}
