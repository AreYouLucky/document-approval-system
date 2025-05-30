<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\HrisUser;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // if (Auth::guard('hris')->attempt($credentials)) {
        //     return response()->json([
        //         'status' => 'You successfully logged in!'
        //     ]);
        // }

        if(Auth::attempt($credentials)){
                 return Auth::user();
        };

        return response()->json([
            'errors' => [
                'logs' => 'Invalid Credentials!',
            ]
        ], 422);
    }

    public function logout(Request $req)
    {
        Auth::logout();
        $req->session()->invalidate();
        $req->session()->regenerateToken();
        return redirect('/');
    }

    public function hrisUsers(){
        return HrisUser::get();
    }

}
