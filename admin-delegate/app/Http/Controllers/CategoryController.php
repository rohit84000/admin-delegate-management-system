<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
     public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'feed_message' => 'required|string|max:255',
        ]);
        return Category::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $cat = Category::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $id,
            'feed_message' => 'required|string|max:255',
        ]);
        $cat->update($request->all());
        return $cat;
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
