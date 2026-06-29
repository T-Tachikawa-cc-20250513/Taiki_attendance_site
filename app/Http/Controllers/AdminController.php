<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\DailyAttendance;
use App\Models\ClosedAttendance;
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

        $user = User::findOrFail(
            $userId
        );

        // 通常勤怠
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

        // 月締済データがあれば優先表示
        $closedAttendances = ClosedAttendance::with('user')
            ->where('user_id', $userId)
            ->where('target_month', $month)
            ->get();

        if ($closedAttendances->count() > 0) {
            $attendances = $closedAttendances;
        }

        return Inertia::render(
            'Admin/AdminUserAttendance',
            [
                'attendances' => $attendances,
                'month'       => $month,
                'userId'      => $userId,
                'userName'    => $user->name,
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

        // 月締済みデータを確認
        $closedQuery = ClosedAttendance::with('user')
            ->where(
                'user_id',
                $request->user_id
            )
            ->where(
                'target_month',
                $request->month
            );

        if (
            $request->filled('status')
        ) {

            $closedQuery->where(
                'status',
                $request->status
            );
        }

        $closedAttendances = $closedQuery
            ->orderBy('work_date')
            ->get();

        // 月締済ならそちらを返す
        if ($closedAttendances->count() > 0) {

            return response()->json(
                $closedAttendances
            );
        }

        // 通常テーブル検索
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

        $attendance->status =
            '承認済';

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

        $attendance->status =
            '差戻';

        $attendance->save();

        return response()->json([
            'message' => '差し戻しました'
        ]);
    }

    /**
     * 一括承認
     */
    public function bulkApprove(
        Request $request
    ) {

        $request->validate([
            'month'   => 'required|date_format:Y-m',
            'user_id' => 'required|integer',
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

        DailyAttendance::where(
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
        )
        ->where(
            'status',
            '申請中'
        )
        ->update([
            'status' => '承認済'
        ]);

        return response()->json([
            'message' => '一括承認しました'
        ]);
    }
}