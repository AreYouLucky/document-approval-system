<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAction extends Model
{
    protected $table = 'user_actions';
    protected $primaryKey = 'id';
    protected $fillable = [
        'action_maker',
        'action_made',
        'affected_user'
    ];
}
