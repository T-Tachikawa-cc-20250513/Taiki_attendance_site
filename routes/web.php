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

Route::post('/punch', [AttendanceController::class, 'punch']);