<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $table = 'documents';
    protected $primaryKey = 'document_id';
    protected $fillable = [
        'code',
        'division',
        'text_conversion',
        'section'
    ];


    public function documentRevisions()
    {
        return $this->hasMany(DocumentRevision::class, 'document_id', 'document_id');
    }

    public function latestRevision()
    {
        return $this->hasOne(DocumentRevision::class, 'document_id')->latestOfMany('revision_id');
    }

}
