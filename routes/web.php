<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\AttendanceController;

//打刻画面
Route::get('/', function () {
    return Inertia::render('Attendance/Punch');
});

// 勤怠一覧
Route::get('/attendances', function () {
    return Inertia::render('Attendance/Index');
});

// 管理者画面
Route::get('/admin', function () {
    return Inertia::render('Admin/Dashboard');
});

//dashboard
Route::middleware('auth')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Attendance/Punch');
    })->name('dashboard');

    Route::post('/punch', [AttendanceController::class, 'punch']);
});

require __DIR__.'/auth.php';