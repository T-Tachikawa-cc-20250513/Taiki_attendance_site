<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\DailyAttendance;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * 管理画面TOP
     */
    public function index()
    {
        $users = User::orderBy('id')
            ->get();

        return Inertia::render(
            'Admin/AdminDashboard',
            [
                'users' => $users,
            ]
        );
    }

    /**
     * ユーザー選択後
     */
    public function showUser(
        Request $request,
        $userId
    ) {
        $month = now()->format('Y-m');

        $attendances = DailyAttendance::with(
            'user'
        )
        ->where(
            'user_id',
            $userId
        )
        ->whereYear(
            'work_date',
            substr($month, 0, 4)
        )
        ->whereMonth(
            'work_date',
            substr($month, 5, 2)
        )
        ->where(
            'status',
            '申請中'
        )
        ->get();

        return Inertia::render(
            'Admin/AdminUserAttendance',
            [
                'attendances' => $attendances,
                'month'       => $month,
                'userId'      => $userId,
            ]
        );
    }

    /**
     * 月変更・状態変更時取得
     */
    public function getAttendances(
        Request $request
    ) {
        $request->validate([
            'month'   => 'required|date_format:Y-m',
            'user_id' => 'required|integer',
            'status'  => 'nullable|string',
        ]);

        $year = substr(
            $request->month,
            0,
            4
        );

        $month = substr(
            $request->month,
            5,
            2
        );

        $query = DailyAttendance::with(
            'user'
        )
        ->where(
            'user_id',
            $request->user_id
        )
        ->whereYear(
            'work_date',
            $year
        )
        ->whereMonth(
            'work_date',
            $month
        );

        if (
            $request->filled('status')
        ) {
            $query->where(
                'status',
                $request->status
            );
        }

        $attendances = $query
            ->orderBy('work_date')
            ->get();

        return response()->json(
            $attendances
        );
    }

    /**
     * 承認
     */
    public function approve($id)
    {
        $attendance =
            DailyAttendance::findOrFail($id);

        $attendance->status = '承認済';

        $attendance->save();

        return response()->json([
            'message' => '承認しました'
        ]);
    }

    /**
     * 差戻
     */
    public function reject(
        Request $request,
        $id
    ) {
        $request->validate([
            'reason' => 'required|string',
        ]);

        $attendance =
            DailyAttendance::findOrFail($id);

        $attendance->status = '差戻';

        // 差戻理由を保存するカラムがある場合
        // $attendance->reject_reason
        //     = $request->reason;

        $attendance->save();

        return response()->json([
            'message' => '差し戻しました'
        ]);
    }
}