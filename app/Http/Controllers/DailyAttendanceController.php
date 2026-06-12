<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DailyAttendance;
use Carbon\Carbon;
use Inertia\Inertia;

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

        return Inertia::render(
            'Attendance/DailyAttendance',
            [
                'attendance' => $attendance,
                'targetDate' => $date,
                'todayIn' => null,
                'todayOut' => null,
            ]
        );
    }
}