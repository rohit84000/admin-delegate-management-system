<?php

namespace App\Http\Controllers;

use App\Http\Requests\DelegateLoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
  public function adminLogin(Request $request)
    {
        if(!$token = auth()->attempt($request->only('email','password'))){
            return response()->json(['error'=>'Invalid'],401);
        }

        if(auth()->user()->role !== 'admin'){
            return response()->json(['error'=>'Not admin'],403);
        }

        return response()->json([
            'token' => $token,
            'user'  => auth()->user()
        ]);
    }


    public function delegateLogin(Request $request)
    {
        $credentials = $request->only('email','password');

        if (!auth()->attempt($credentials)) {
            return response()->json([
                'error' => 'Invalid credentials'
            ], 401);
        }

        $user = auth()->user();

        if ($user->role !== 'delegate') {
            return response()->json([
                'error' => 'Not a delegate account'
            ], 403);
        }

        if ($user->type !== 'active') {
            return response()->json([
                'error' => 'Your account is inactive'
            ], 403);
        }

        $token = auth()->login($user);

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }


    public function logout()
    {
        auth()->logout(); // invalidates JWT
        return response()->json(['message' => 'Logged out successfully']);
    }



}
