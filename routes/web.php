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
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\AdminLeaveRequestController;

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

    return Inertia::render(
        'Attendance/Punch',
        [
            'lastPunchType' => $lastPunch?->punch_type,
            'todayIn'       => $todayIn?->punched_at,
            'todayOut'      => $todayOut?->punched_at,
        ]
    );
});

// 管理者専用
Route::middleware([
    'auth',
    'admin',
])->group(function () {

    // 管理者画面
    Route::get(
        '/admin',
        [AdminController::class, 'index']
    );

    // ユーザー取得
    Route::get(
        '/admin/user/{userId}',
        [AdminController::class, 'showUser']
    );

    // 対象月勤怠取得
    Route::get(
        '/admin/attendances',
        [AdminController::class, 'getAttendances']
    );

    // 承認
    Route::post(
        '/admin/attendance/{id}/approve',
        [AdminController::class, 'approve']
    );

    // 差戻
    Route::post(
        '/admin/attendance/{id}/reject',
        [AdminController::class, 'reject']
    );

    // 一括承認
    Route::post(
        '/admin/bulk-approve',
        [AdminController::class, 'bulkApprove']
    );

    /*
    |--------------------------------------------------------------------------
    | 管理者 届出機能
    |--------------------------------------------------------------------------
    */

    // 届出一覧
    Route::get(
        '/admin/leave-requests',
        [AdminLeaveRequestController::class, 'index']
    );

    // 個別承認
    Route::post(
        '/admin/leave-requests/{id}/approve',
        [AdminLeaveRequestController::class, 'approve']
    );

    // 一括承認
    Route::post(
        '/admin/leave-requests/bulk-approve',
        [AdminLeaveRequestController::class, 'bulkApprove']
    );

    // 差戻
    Route::post(
        '/admin/leave-requests/{id}/reject',
        [AdminLeaveRequestController::class, 'reject']
    );
});

// ログイン後
Route::middleware('auth')->group(function () {

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
                    'todayIn'    => null,
                    'todayOut'   => null,
                ]
            );
        }
    );

    // 登録
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

    // 日付指定画面
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

    /*
    |--------------------------------------------------------------------------
    | ユーザー 届出機能
    |--------------------------------------------------------------------------
    */

    // 届出一覧画面
    Route::get(
        '/leave-requests',
        [LeaveRequestController::class, 'index']
    );

    // 届出登録画面
    Route::get(
        '/leave-request/create',
        [LeaveRequestController::class, 'create']
    );

    // 届出保存（未申請）
    Route::post(
        '/leave-request/save',
        [LeaveRequestController::class, 'store']
    );

    // 届出申請
    Route::post(
        '/leave-request/apply',
        [LeaveRequestController::class, 'apply']
    );

    // 申請取消
    Route::post(
        '/leave-request/{id}/cancel',
        [LeaveRequestController::class, 'cancel']
    );
});

require __DIR__ . '/auth.php';