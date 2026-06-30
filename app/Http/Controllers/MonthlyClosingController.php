<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\MonthlyClosing;
use App\Models\DailyAttendance;
use Carbon\Carbon;

class MonthlyClosingController extends Controller
{
    /**
     * 月締実行
     */
    public function close(Request $request)
    {
        $request->validate([
            'month'   => 'required|date_format:Y-m',
            'user_id' => 'nullable|integer',
        ]);

        $startDate = Carbon::parse($request->month . '-01');
        $endDate = $startDate->copy()->endOfMonth();

        // user_id指定なら対象ユーザーのみ
        $users = $request->filled('user_id')
            ? User::where('id', $request->user_id)->get()
            : User::all();

        /*
        |--------------------------------------------------------------------------
        | 月締チェック
        |--------------------------------------------------------------------------
        */

        $errorMessages = [];

        foreach ($users as $user) {

            for (
                $date = $startDate->copy();
                $date <= $endDate;
                $date->addDay()
            ) {

                $attendance = DailyAttendance::where(
                    'user_id',
                    $user->id
                )
                ->whereDate(
                    'work_date',
                    $date->toDateString()
                )
                ->first();

                // 勤怠未登録
                if (!$attendance) {

                    $errorMessages['未登録'][] =
                        $date->format('Y/m/d');

                    continue;
                }

                // 未承認
                if (
                    in_array(
                        $attendance->status,
                        [
                            '未申請',
                            '申請中',
                            '差戻'
                        ]
                    )
                ) {

                    $errorMessages['未承認'][] =
                        $date->format('Y/m/d');

                    continue;
                }

                // 勤務区分
                if (empty($attendance->work_type)) {

                    $errorMessages['勤務区分未入力'][] =
                        $date->format('Y/m/d');

                    continue;
                }

                // 出勤日のチェック
                if ($attendance->work_type === '出勤') {

                    if (empty($attendance->office)) {

                        $errorMessages['勤務先未入力'][] =
                            $date->format('Y/m/d');

                        continue;
                    }

                    if (empty($attendance->start_time)) {

                        $errorMessages['出勤時刻未入力'][] =
                            $date->format('Y/m/d');

                        continue;
                    }

                    if (empty($attendance->end_time)) {

                        $errorMessages['退勤時刻未入力'][] =
                            $date->format('Y/m/d');

                        continue;
                    }

                    if (empty($attendance->break_start_time)) {

                        $errorMessages['休憩開始未入力'][] =
                            $date->format('Y/m/d');

                        continue;
                    }

                    if (empty($attendance->break_end_time)) {

                        $errorMessages['休憩終了未入力'][] =
                            $date->format('Y/m/d');

                        continue;
                    }

                    if ($attendance->transportation_fee === null) {

                        $errorMessages['交通費未入力'][] =
                            $date->format('Y/m/d');

                        continue;
                    }

                    // 勤務時間チェック
                    if (
                        Carbon::parse($attendance->start_time)
                            ->gte(Carbon::parse($attendance->end_time))
                    ) {

                        $errorMessages['勤務時間不備'][] =
                            $date->format('Y/m/d');

                        continue;
                    }

                    // 休憩時間チェック
                    if (
                        Carbon::parse($attendance->break_start_time)
                            ->gte(Carbon::parse($attendance->break_end_time))
                    ) {

                        $errorMessages['休憩時間不備'][] =
                            $date->format('Y/m/d');

                        continue;
                    }
                }
            }
        }

        foreach ($errorMessages as $key => $dates) {
            $errorMessages[$key] = array_unique($dates);
        }

        if (!empty($errorMessages)) {
            $message = "以下の日程に不備があります。\n\n";
            foreach ($errorMessages as $title => $dates) {
                $message .= "【{$title}】\n";
                foreach ($dates as $date) {
                    $message .= "・{$date}\n";
                }
                $message .= "\n";
            }

            return response()->json([
                'message' => trim($message)
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | 月締実行
        |--------------------------------------------------------------------------
        */

        foreach ($users as $user) {

            MonthlyClosing::firstOrCreate(
                [
                    'user_id'      => $user->id,
                    'target_month' => $request->month,
                ],
                [
                    'closed_at' => now(),
                    'closed_by' => Auth::id(),
                ]
            );
        }

        $message = $request->filled('user_id')
            ? "{$users->first()->name} の {$request->month} を月締しました。"
            : "{$request->month} の全ユーザー月締を実施しました。";

        return response()->json([
            'message' => $message
        ]);
    }
}