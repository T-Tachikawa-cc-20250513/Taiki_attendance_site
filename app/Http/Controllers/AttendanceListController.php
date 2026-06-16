<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DailyAttendance;
use Carbon\Carbon;
use Inertia\Inertia;

class AttendanceListController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->month ?? now()->format('Y-m');

        $attendanceMap = DailyAttendance::where(
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
        )
        ->get()
        ->keyBy('work_date');

        $startDate = Carbon::parse(
            $month . '-01'
        );

        $endDate = $startDate
            ->copy()
            ->endOfMonth();

        $attendances = [];

        // 月間集計用
        $monthlyTransportationFee = 0;
        $workDays = 0;
        $totalWorkMinutes = 0;
        $applyingCount = 0;
        $approvedCount = 0;

        for (
            $date = $startDate->copy();
            $date <= $endDate;
            $date->addDay()
        ) {

            $dateString = $date
                ->toDateString();

            $attendance =
                $attendanceMap[$dateString]
                ?? null;

            $breakMinutes = 0;

            if (
                $attendance?->break_start_time
                &&
                $attendance?->break_end_time
            ) {

                $breakMinutes =
                    Carbon::parse(
                        $attendance->break_start_time
                    )->diffInMinutes(
                        Carbon::parse(
                            $attendance->break_end_time
                        )
                    );
            }

            // 月間交通費
            $monthlyTransportationFee +=
                $attendance?->transportation_fee ?? 0;

            // 出勤日数
            if ($attendance?->work_type === '出勤') {

                $workDays++;
            }

            // 総勤務時間
            if (
                $attendance?->start_time
                &&
                $attendance?->end_time
            ) {

                $workMinutes =
                    Carbon::parse(
                        $attendance->start_time
                    )->diffInMinutes(
                        Carbon::parse(
                            $attendance->end_time
                        )
                    );

                $totalWorkMinutes +=
                    max(
                        $workMinutes - $breakMinutes,
                        0
                    );
            }

            // ステータス件数
            if (
                $attendance?->status === '申請中'
            ) {

                $applyingCount++;
            }

            if (
                $attendance?->status === '承認済'
            ) {

                $approvedCount++;
            }

            $attendances[] = [
                'id' => $attendance?->id,
                'work_date' => $dateString,
                'work_type' => $attendance?->work_type,
                'start_time' => $attendance?->start_time,
                'end_time' => $attendance?->end_time,
                'break_minutes' => $breakMinutes,
                'transportation_fee' => $attendance?->transportation_fee,
                'status' => $attendance?->status ?? '未申請',
            ];
        }

        // 勤務区分絞り込み
        if ($request->work_type) {

            $attendances = array_filter(
                $attendances,
                function ($attendance) use ($request) {

                    return $attendance['work_type']
                        === $request->work_type;
                }
            );
        }

        // ステータス絞り込み
        if ($request->status) {

            $attendances = array_filter(
                $attendances,
                function ($attendance) use ($request) {

                    return $attendance['status']
                        === $request->status;
                }
            );
        }

        $attendances = array_values(
            $attendances
        );

        $hasUnapplied = collect($attendances)
            ->contains(function ($attendance) {

                return
                    !empty($attendance['id'])
                    &&
                    $attendance['status'] === '未申請';
            });

        return Inertia::render(
            'Attendance/Index',
            [
                'attendances' => $attendances,
                'month' => $month,
                'workType' => $request->work_type,
                'status' => $request->status,

                // 月間集計
                'monthlyTransportationFee' => $monthlyTransportationFee,
                'workDays' => $workDays,
                'totalWorkHours' =>
                    sprintf(
                        '%02d:%02d',
                        floor($totalWorkMinutes / 60),
                        $totalWorkMinutes % 60
                    ),
                'applyingCount' => $applyingCount,
                'approvedCount' => $approvedCount,
                'hasUnapplied' => $hasUnapplied,
            ]
        );
    }
}