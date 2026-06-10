<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AttendanceRawPunch;

class AttendanceController extends Controller
{
    public function punch(Request $request)
    {
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

        // 出勤済み、または退勤済みなら再出勤不可
        if (
            $request->punch_type === 'IN'
            && ($todayIn || $todayOut)
        ) {
            return response()->json([
                'message' => '本日の出勤打刻は既に完了しています'
            ], 400);
        }

        // 退勤済みなら再退勤不可
        if (
            $request->punch_type === 'OUT'
            && $todayOut
        ) {
            return response()->json([
                'message' => '本日の退勤打刻は既に完了しています'
            ], 400);
        }

        $lastPunch = AttendanceRawPunch::where(
                'user_id',
                Auth::id()
            )
            ->latest('punched_at')
            ->first();

        // 同じ打刻の連続防止
        if (
            $lastPunch &&
            $lastPunch->punch_type === $request->punch_type
        ) {
            return response()->json([
                'message' => '同じ打刻はできません'
            ], 400);
        }

        AttendanceRawPunch::create([
            'user_id' => Auth::id(),
            'punch_type' => $request->punch_type,
            'punched_at' => now(),
            'source' => 'WEB',
        ]);

        return response()->json([
            'message' => '打刻しました'
        ]);
    }
}