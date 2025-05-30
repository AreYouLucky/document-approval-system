<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditComment extends Model
{
    use HasFactory;
    protected $table = 'audit_comments';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'comments',
        'location',
        'revision_id',
        'document_id',
        'comment_date',
        'audit_logs_id',
        'reviewer',
        'is_resolved',
    ];
}
