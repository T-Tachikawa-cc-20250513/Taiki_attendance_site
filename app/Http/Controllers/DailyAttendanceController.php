<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DailyAttendance;

class DailyAttendanceController extends Controller
{
    public function store(Request $request)
    {
        $dailyAttendance = DailyAttendance::create([
            'user_id' => Auth::id(),
            'work_date' => today(),
            'work_type' => $request->work_type,
            'office' => $request->office,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'transportation_fee' => $request->transportation_fee,
            'remark' => $request->remark,
            'status' => '申請中',
        ]);

        return response()->json([
            'message' => '申請成功です！',
        ]);
    }
}