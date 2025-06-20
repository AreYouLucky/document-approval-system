<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CredentialsController extends Controller
{
    public function getApiIp(){
        $ip = env('api_ip');
        return $ip;
    }
}
