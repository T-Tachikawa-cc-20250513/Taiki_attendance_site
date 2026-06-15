<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DailyAttendance;
use Inertia\Inertia;

class AttendanceListController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->month ?? now()->format('Y-m');

        $query = DailyAttendance::where(
            'user_id',
            Auth::id()
        )
        ->whereYear(
            'work_date',
            substr($month, 0, 4)
        )
        ->whereMonth(
            'work_date',
            substr($month, 5, 2)
        );

        if ($request->work_type) {
            $query->where(
                'work_type',
                $request->work_type
            );
        }

        if ($request->status) {
            $query->where(
                'status',
                $request->status
            );
        }

        $attendances = $query
            ->orderBy('work_date')
            ->get();

        return Inertia::render(
            'Attendance/Index',
            [
                'attendances' => $attendances,
                'month' => $month,
                'workType' => $request->work_type,
                'status' => $request->status,
            ]
        );
    }
}