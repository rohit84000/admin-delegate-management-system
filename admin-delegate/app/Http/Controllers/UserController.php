<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            "first_name" => "required",
            "last_name" => "required",
            "email" => "required|email|unique:users",
            "password" => "required|min:6",
            "role" => "required|in:admin,delegate",
            "type" => "required|in:active,inactive"
        ]);

        return User::create([
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "email" => $request->email,
            "password" => bcrypt($request->password),
            "role" => $request->role,
            "type" => $request->type
        ]);
    }

    // public function update(Request $request, $id)
    // {
    //     $user = User::findOrFail($id);

    //     $user->update([
    //         "first_name" => $request->first_name,
    //         "last_name" => $request->last_name,
    //         "email" => $request->email,
    //         "role" => $request->role,
    //         "type" => $request->type
    //     ]);

    //     if ($request->password) {
    //         $user->update([
    //             "password" => bcrypt($request->password)
    //         ]);
    //     }

    //     return $user;
    // }

    // public function destroy($id)
    // {
    //     return User::destroy($id);
    // }
}
