<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AttendanceRawPunch;

class AttendanceController extends Controller
{
    public function punch(Request $request)
    {
        $lastPunch = AttendanceRawPunch::where(
            'user_id',
            Auth::id()
        )
        ->latest('punched_at')
        ->first();

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