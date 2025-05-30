<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\UserAction;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function index(){
        return Inertia::render('Users/UserList');
    }

    public function loadUsers(){
        return User::select('id', 'full_name','email','division', 'qms_role','image_path','position','username')->get();
    }

    public function changeRole(Request $req){
        $req->validate([
            'id' => 'required|string',
            'role' => 'required|string',
        ]);
        User::where('id', $req->id)->update([
            'qms_role' => $req->role
        ]);
        UserAction::create([
            'action_maker'=> Auth::user()->id,
            'action_made'=> 'Update user role to '. $req->role,
            'affected_user' => $req->id
        ]);

        return response()->json([
            'status' => 'Role Successfully updated! '
        ],200);
    }
}
