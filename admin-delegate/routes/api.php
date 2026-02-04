<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DelegateController;
use App\Http\Controllers\UserController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/admin/login',[AuthController::class,'adminLogin']);
Route::post('/delegate/login',[AuthController::class,'delegateLogin']);

Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:api')->get('/me', function(){
    return auth()->user();
});


Route::middleware(['auth:api','role:admin'])->group(function(){
    Route::apiResource('delegates',DelegateController::class);
    Route::apiResource('categories',CategoryController::class);
    Route::apiResource('users', UserController::class);
});

Route::middleware(['auth:api','role:delegate'])->get('/delegate/dashboard', function(){
    $user = auth()->user();
    return [
        'user'=>$user,
        'category'=>$user->category->first()
    ];
});

