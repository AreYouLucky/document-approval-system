<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class HrisUser extends Authenticatable
{
    protected $connection = 'hris';
    protected $table = 'tbluser';
    protected $primaryKey = 'id';
    protected $fillable = [
        'username',  'password',
    ];
}
