<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Models\AttendanceRawPunch;
use App\Http\Controllers\AttendanceController;

// 打刻画面（未ログインでも表示）
Route::get('/', function () {

    $lastPunch = null;
    $todayIn = null;
    $todayOut = null;

    if (Auth::check()) {

        $lastPunch = AttendanceRawPunch::where(
            'user_id',
            Auth::id()
        )
        ->latest('punched_at')
        ->first();

        $todayIn = AttendanceRawPunch::where(
            'user_id',
            Auth::id()
        )
        ->whereDate('punched_at', today())
        ->where('punch_type', 'IN')
        ->orderBy('punched_at')
        ->first();

        $todayOut = AttendanceRawPunch::where(
            'user_id',
            Auth::id()
        )
        ->whereDate('punched_at', today())
        ->where('punch_type', 'OUT')
        ->latest('punched_at')
        ->first();
    }

    return Inertia::render('Attendance/Punch', [
        'lastPunchType' => $lastPunch?->punch_type,
        'todayIn'       => $todayIn?->punched_at,
        'todayOut'      => $todayOut?->punched_at,
    ]);
});

// 勤怠一覧
Route::get('/attendances', function () {
    return Inertia::render('Attendance/Index');
});

// 管理者画面
Route::get('/admin', function () {
    return Inertia::render('Admin/Dashboard');
});

// ログイン後
Route::middleware('auth')->group(function () {

    Route::get('/dashboard', function () {

        $lastPunch = AttendanceRawPunch::where(
            'user_id',
            Auth::id()
        )
        ->latest('punched_at')
        ->first();

        $todayIn = AttendanceRawPunch::where(
            'user_id',
            Auth::id()
        )
        ->whereDate('punched_at', today())
        ->where('punch_type', 'IN')
        ->orderBy('punched_at')
        ->first();

        $todayOut = AttendanceRawPunch::where(
            'user_id',
            Auth::id()
        )
        ->whereDate('punched_at', today())
        ->where('punch_type', 'OUT')
        ->latest('punched_at')
        ->first();

        return Inertia::render('Attendance/Punch', [
            'lastPunchType' => $lastPunch?->punch_type,
            'todayIn'       => $todayIn?->punched_at,
            'todayOut'      => $todayOut?->punched_at,
        ]);

    })->name('dashboard');

    Route::post('/punch', [AttendanceController::class, 'punch']);
});

require __DIR__.'/auth.php';

// 日次勤怠登録画面
Route::middleware('auth')->group(function () {
    Route::get('/daily-attendance', function () {

        $todayIn = null;
        $todayOut = null;

        if (Auth::check()) {
            $todayIn = AttendanceRawPunch::where(
                'user_id',
                Auth::id()
            )
            ->whereDate('punched_at', today())
            ->where('punch_type', 'IN')
            ->orderBy('punched_at')
            ->first();

            $todayOut = AttendanceRawPunch::where(
                'user_id',
                Auth::id()
            )
            ->whereDate('punched_at', today())
            ->where('punch_type', 'OUT')
            ->latest('punched_at')
            ->first();

        }

        return Inertia::render(
            'Attendance/DailyAttendance',
            [
                'todayIn' => $todayIn?->punched_at,
                'todayOut' => $todayOut?->punched_at,
            ]
        );
    });
});