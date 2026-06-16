<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AttendanceRawPunch;
use App\Models\DailyAttendance;

class AttendanceController extends Controller
{
    public function punch(Request $request)
    {
        $request->validate([
            'punch_type' => 'required|in:IN,OUT',
        ]);

        $todayIn = AttendanceRawPunch::where(
                'user_id',
                Auth::id()
            )
            ->where('punch_type', 'IN')
            ->whereDate('punched_at', today())
            ->exists();

        $todayOut = AttendanceRawPunch::where(
                'user_id',
                Auth::id()
            )
            ->where('punch_type', 'OUT')
            ->whereDate('punched_at', today())
            ->exists();

        // 本日の出勤済みなら再出勤不可
        if (
            $request->punch_type === 'IN'
            && $todayIn
        ) {
            return response()->json([
                'message' => '本日の出勤打刻は既に完了しています'
            ], 400);
        }

        // 出勤前は退勤不可
        if (
            $request->punch_type === 'OUT'
            && !$todayIn
        ) {
            return response()->json([
                'message' => '出勤打刻後に退勤してください'
            ], 400);
        }

        // 本日の退勤済みなら再退勤不可
        if (
            $request->punch_type === 'OUT'
            && $todayOut
        ) {
            return response()->json([
                'message' => '本日の退勤打刻は既に完了しています'
            ], 400);
        }

        // 今日の最後の打刻のみ取得
        $lastPunch = AttendanceRawPunch::where(
                'user_id',
                Auth::id()
            )
            ->whereDate(
                'punched_at',
                today()
            )
            ->latest('punched_at')
            ->first();

        // 同日のみ連続打刻防止
        if (
            $lastPunch &&
            $lastPunch->punch_type === $request->punch_type
        ) {
            return response()->json([
                'message' => '同じ打刻はできません'
            ], 400);
        }

        // 打刻保存
        AttendanceRawPunch::create([
            'user_id' => Auth::id(),
            'punch_type' => $request->punch_type,
            'punched_at' => now(),
            'source' => 'WEB',
        ]);

        // 勤怠登録へ自動反映
        $attendance = DailyAttendance::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'work_date' => today(),
            ],
            [
                'work_type' => '出勤',
                'status' => '未申請',
            ]
        );

        // 出勤打刻
        if (
            $request->punch_type === 'IN'
            && !$attendance->start_time
        ) {
            $attendance->start_time =
                now()->format('H:i:s');
        }

        // 退勤打刻
        if (
            $request->punch_type === 'OUT'
            && !$attendance->end_time
        ) {
            $attendance->end_time =
                now()->format('H:i:s');
        }

        $attendance->save();

        return response()->json([
            'message' => '打刻しました'
        ]);
    }
}