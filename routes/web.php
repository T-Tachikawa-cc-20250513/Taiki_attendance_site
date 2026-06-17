<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Models\AttendanceRawPunch;
use App\Models\DailyAttendance;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DailyAttendanceController;
use App\Http\Controllers\AttendanceListController;
use App\Http\Controllers\AdminController;

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

// 管理者画面
Route::get(
    '/admin',
    [AdminController::class, 'index']
);

//ログイン後
Route::middleware('auth')->group(function(){
    // 打刻
    Route::post(
        '/punch',
        [AttendanceController::class, 'punch']
    );

    // 日次勤怠画面（今日）
    Route::get(
        '/daily-attendance',
        function () {

            $attendance = DailyAttendance::where(
                'user_id',
                Auth::id()
            )
            ->whereDate(
                'work_date',
                today()
            )
            ->first();

            return Inertia::render(
                'Attendance/DailyAttendance',
                [
                    'attendance' => $attendance,
                    'targetDate' => today()->toDateString(),
                    'todayIn' => null,
                    'todayOut' => null,
                ]
            );
        }
    );

    // 登録（未申請）
    Route::post(
        '/daily-attendance/save',
        [DailyAttendanceController::class, 'save']
    );

    // 申請
    Route::post(
        '/daily-attendance/apply',
        [DailyAttendanceController::class, 'apply']
    );

    // 一括申請
    Route::post(
        '/daily-attendance/bulk-apply',
        [DailyAttendanceController::class, 'bulkApply']
    );

    // 日付指定の日次勤怠画面
    Route::get(
        '/daily-attendance/{date}',
        [DailyAttendanceController::class, 'show']
    );

    // 申請取消
    Route::post(
        '/daily-attendance/{id}/toggle-status',
        [DailyAttendanceController::class, 'toggleStatus']
    );

    // 勤怠一覧
    Route::get(
        '/attendances',
        [AttendanceListController::class, 'index']
    );
});

require __DIR__.'/auth.php';