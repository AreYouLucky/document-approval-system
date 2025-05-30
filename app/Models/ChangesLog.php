<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChangesLog extends Model
{
    protected $table = 'changes_logs';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'changes',
        'revision_id',
        'document_id',
        'change_date'
    ];
}
