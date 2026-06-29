<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DailyAttendance;
use App\Models\MonthlyClosing;
use Inertia\Inertia;

class DailyAttendanceController extends Controller
{
    /**
     * 非勤務系勤務区分
     */
    private array $nonWorkingTypes = [
        '公休',
    ];

    /**
     * 月締済チェック
     * ※管理者は月締後も編集可能
     */
    private function isClosed($date)
    {
        // 管理者は月締後も編集可能
        if (Auth::user()?->role === 'admin') {
            return false;
        }

        return MonthlyClosing::where(
            'user_id',
            Auth::id()
        )
        ->where(
            'target_month',
            date('Y-m', strtotime($date))
        )
        ->exists();
    }

    // 登録（未申請）
    public function save(Request $request)
    {
        if ($this->isClosed($request->target_date)) {

            return response()->json([
                'message' => '月締済のため編集できません'
            ], 403);
        }

        $request->validate([
            'target_date' => 'required|date',
            'work_type'   => 'required',
        ]);

        $isNonWorkingType = in_array(
            $request->work_type,
            $this->nonWorkingTypes
        );

        DailyAttendance::updateOrCreate(
            [
                'user_id'   => Auth::id(),
                'work_date' => $request->target_date,
            ],
            [
                'work_type' => $request->work_type,

                'office' => $isNonWorkingType
                    ? null
                    : $request->office,

                'start_time' => $isNonWorkingType
                    ? null
                    : $request->start_time,

                'end_time' => $isNonWorkingType
                    ? null
                    : $request->end_time,

                'break_start_time' => $isNonWorkingType
                    ? null
                    : $request->break_start_time,

                'break_end_time' => $isNonWorkingType
                    ? null
                    : $request->break_end_time,

                'transportation_fee' => $isNonWorkingType
                    ? 0
                    : $request->transportation_fee,

                'remark' => $request->remark,
                'status' => '未申請',
            ]
        );

        return response()->json([
            'message' => '登録しました'
        ]);
    }

    // 申請
    public function apply(Request $request)
    {
        if ($this->isClosed($request->target_date)) {

            return response()->json([
                'message' => '月締済のため編集できません'
            ], 403);
        }

        $request->validate([
            'target_date' => 'required|date',
            'work_type'   => 'required',
        ]);

        $isNonWorkingType = in_array(
            $request->work_type,
            $this->nonWorkingTypes
        );

        if (!$isNonWorkingType) {

            if (empty($request->start_time)) {
                return response()->json([
                    'message' => '出勤時刻は入力必須です'
                ], 422);
            }

            if (empty($request->end_time)) {
                return response()->json([
                    'message' => '退勤時刻は入力必須です'
                ], 422);
            }

            if (empty($request->break_start_time)) {
                return response()->json([
                    'message' => '休憩開始時刻は入力必須です'
                ], 422);
            }

            if (empty($request->break_end_time)) {
                return response()->json([
                    'message' => '休憩終了時刻は入力必須です'
                ], 422);
            }
        }

        DailyAttendance::updateOrCreate(
            [
                'user_id'   => Auth::id(),
                'work_date' => $request->target_date,
            ],
            [
                'work_type' => $request->work_type,

                'office' => $isNonWorkingType
                    ? null
                    : $request->office,

                'start_time' => $isNonWorkingType
                    ? null
                    : $request->start_time,

                'end_time' => $isNonWorkingType
                    ? null
                    : $request->end_time,

                'break_start_time' => $isNonWorkingType
                    ? null
                    : $request->break_start_time,

                'break_end_time' => $isNonWorkingType
                    ? null
                    : $request->break_end_time,

                'transportation_fee' => $isNonWorkingType
                    ? 0
                    : $request->transportation_fee,

                'remark' => $request->remark,
                'status' => '申請中',
            ]
        );

        return response()->json([
            'message' => '申請成功です！'
        ]);
    }

    public function show($date)
    {
        $attendance = DailyAttendance::where(
            'user_id',
            Auth::id()
        )
        ->whereDate(
            'work_date',
            $date
        )
        ->first();

        $isClosed = false;

        // 管理者以外のみ月締判定
        if (Auth::user()?->role !== 'admin') {

            $isClosed = MonthlyClosing::where(
                'user_id',
                Auth::id()
            )
            ->where(
                'target_month',
                date('Y-m', strtotime($date))
            )
            ->exists();
        }

        return Inertia::render(
            'Attendance/DailyAttendance',
            [
                'attendance' => $attendance,
                'targetDate' => $date,
                'todayIn'    => null,
                'todayOut'   => null,
                'isClosed'   => $isClosed,
            ]
        );
    }

    public function toggleStatus($id)
    {
        $attendance = DailyAttendance::where(
            'user_id',
            Auth::id()
        )->findOrFail($id);

        if ($this->isClosed($attendance->work_date)) {

            return response()->json([
                'message' => '月締済のため変更できません'
            ], 403);
        }

        if (
            !in_array(
                $attendance->status,
                ['未申請', '申請中']
            )
        ) {
            return response()->json([
                'message' => '変更できません'
            ], 400);
        }

        $attendance->status =
            $attendance->status === '申請中'
                ? '未申請'
                : '申請中';

        $attendance->save();

        return response()->json([
            'status' => $attendance->status
        ]);
    }

    public function bulkApply(Request $request)
    {
        $request->validate([
            'year'  => 'required|integer',
            'month' => 'required|integer|between:1,12',
        ]);

        $targetMonth = sprintf(
            '%04d-%02d',
            $request->year,
            $request->month
        );

        if (
            Auth::user()?->role !== 'admin'
            &&
            MonthlyClosing::where(
                'user_id',
                Auth::id()
            )
            ->where(
                'target_month',
                $targetMonth
            )
            ->exists()
        ) {
            return response()->json([
                'message' => '月締済のため変更できません'
            ], 403);
        }

        $startDate = "{$targetMonth}-01";

        $endDate = date(
            'Y-m-t',
            strtotime($startDate)
        );

        $hasUnapplied = DailyAttendance::where(
            'user_id',
            Auth::id()
        )
        ->whereBetween(
            'work_date',
            [$startDate, $endDate]
        )
        ->where(
            'status',
            '未申請'
        )
        ->exists();

        if ($hasUnapplied) {

            DailyAttendance::where(
                'user_id',
                Auth::id()
            )
            ->whereBetween(
                'work_date',
                [$startDate, $endDate]
            )
            ->where(
                'status',
                '未申請'
            )
            ->update([
                'status' => '申請中'
            ]);

            return response()->json([
                'message'    => '一括申請しました',
                'bulkStatus' => '申請中'
            ]);
        }

        DailyAttendance::where(
            'user_id',
            Auth::id()
        )
        ->whereBetween(
            'work_date',
            [$startDate, $endDate]
        )
        ->where(
            'status',
            '申請中'
        )
        ->update([
            'status' => '未申請'
        ]);

        return response()->json([
            'message'    => '一括申請を取消しました',
            'bulkStatus' => '未申請'
        ]);
    }
}