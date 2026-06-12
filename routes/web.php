<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Models\AttendanceRawPunch;
use App\Models\DailyAttendance;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DailyAttendanceController;
use App\Http\Controllers\AttendanceListController;

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

//管理者画面
Route::get('/admin', function () {
    return Inertia::render('Admin/Dashboard');
});

//ログイン後の処理
Route::middleware('auth')->group(function () {

    //ダッシュボード（打刻画面）
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

    // 打刻
    Route::post(
        '/punch',
        [AttendanceController::class, 'punch']
    );

    // 日次勤怠登録画面
    Route::get('/daily-attendance', function () {

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

        $dailyAttendance = DailyAttendance::where(
            'user_id',
            Auth::id()
        )
        ->whereDate('work_date', today())
        ->first();

        return Inertia::render(
            'Attendance/DailyAttendance',
            [
                'todayIn' => $todayIn?->punched_at,
                'todayOut' => $todayOut?->punched_at,
                'dailyAttendance' => $dailyAttendance,
            ]
        );
    });

    //日次申請
    Route::post(
        '/daily-attendance',
        [DailyAttendanceController::class, 'store']
    );

    //日次申請（勤怠一覧）
    Route::get(
        '/daily-attendance/{date}',
        [DailyAttendanceController::class, 'show']
    );

    //勤怠一覧
    Route::get(
        '/attendances',
        [AttendanceListController::class, 'index']
    );
});

require __DIR__.'/auth.php';