<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class DelegateController extends Controller
{
    public function index()
    {
        return User::where('role','delegate')
            ->with('category:id,name')
            ->get();
    }


    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6',
            'type'       => 'required|in:active,inactive',
            'category_id'=> 'required|exists:categories,id'
        ]); 

        $user = User::create([
            'first_name'=>$request->first_name,
            'last_name'=>$request->last_name,
            'email'=>$request->email,
            'password'=>bcrypt($request->password),
            'role'=>'delegate',
            'type'=>$request->type
        ]);

        // attach category (many-to-many)
        $user->category()->sync([$request->category_id]);

        // return with category
        return $user->load('category');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email,' . $id,
            'type'       => 'required|in:active,inactive',
            'category_id'=> 'required|exists:categories,id'
        ]);

        $user->update([
            'first_name'=>$request->first_name,
            'last_name'=>$request->last_name,
            'email'=>$request->email,
            'type'=>$request->type
        ]);

        if ($request->password) {
            $user->password = bcrypt($request->password);
            $user->save();
        }

        $user->category()->sync([$request->category_id]);

        return $user->load('category');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->category()->detach();
        $user->delete();
        return response()->json(['message' => 'Deleted']);
    }

}
