<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AttendanceRawPunch;

class AttendanceController extends Controller
{
    public function punch(Request $request)
    {
        AttendanceRawPunch::create([
            'user_id' => 1,
            'punch_type' => $request->punch_type,
            'punched_at' => now(),
            'source' => 'WEB',
        ]);

        return response()->json([
            'message' => '打刻しました'
        ]);
    }
}