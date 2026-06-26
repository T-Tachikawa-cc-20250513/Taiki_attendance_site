<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\DailyAttendance;
use Inertia\Inertia;

class AdminLeaveRequestController extends Controller
{
    /**
     * 届出一覧画面
     */
    public function index(Request $request)
    {
        $userId = $request->userId;
        $status = $request->status ?? '申請中';

        $requests = LeaveRequest::with('user')
            ->where('user_id', $userId)
            ->when(
                $status !== 'すべて',
                function ($query) use ($status) {
                    $query->where(
                        'status',
                        $status
                    );
                }
            )
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render(
            'Admin/AdminLeaveRequestList',
            [
                'requests' => $requests,
                'userId'   => $userId,
                'status'   => $status,
            ]
        );
    }

    /**
     * 個別承認
     */
    public function approve($id)
    {
        $requestData = LeaveRequest::findOrFail($id);

        if ($requestData->status !== '申請中') {

            return response()->json([
                'message' =>
                    '申請中データのみ承認できます'
            ], 400);
        }

        $requestData->status = '承認済';

        // 差戻理由をクリア
        $requestData->reject_reason = null;

        $requestData->save();

        /*
        |--------------------------------------------------------------------------
        | 勤怠テーブルへ反映
        |--------------------------------------------------------------------------
        */
        DailyAttendance::updateOrCreate(
            [
                'user_id'   => $requestData->user_id,
                'work_date' => $requestData->start_date,
            ],
            [
                'work_type'          => $requestData->request_type,
                'office'             => '-',
                'start_time'         => '00:00:00',
                'end_time'           => '00:00:00',
                'transportation_fee' => 0,
                'remark'             => $requestData->reason,
                'status'             => '承認済',
                'manager_comment'    => null,
            ]
        );

        return response()->json([
            'message' => '承認しました'
        ]);
    }

    /**
     * 一括承認
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
        ]);

        $leaveRequests = LeaveRequest::where(
            'user_id',
            $request->user_id
        )
        ->where(
            'status',
            '申請中'
        )
        ->get();

        if ($leaveRequests->isEmpty()) {

            return response()->json([
                'message' => '承認対象がありません'
            ], 400);
        }

        foreach ($leaveRequests as $requestData) {

            $requestData->status = '承認済';
            $requestData->reject_reason = null;
            $requestData->save();

            DailyAttendance::updateOrCreate(
                [
                    'user_id'   => $requestData->user_id,
                    'work_date' => $requestData->start_date,
                ],
                [
                    'work_type'          => $requestData->request_type,
                    'office'             => '-',
                    'start_time'         => '00:00:00',
                    'end_time'           => '00:00:00',
                    'transportation_fee' => 0,
                    'remark'             => $requestData->reason,
                    'status'             => '承認済',
                    'manager_comment'    => null,
                ]
            );
        }

        return response()->json([
            'message' => '一括承認しました'
        ]);
    }

    /**
     * 差戻
     */
    public function reject(
        Request $request,
        $id
    ) {
        $request->validate([
            'reason' =>
                'required|string|max:1000',
        ]);

        $requestData =
            LeaveRequest::findOrFail($id);

        if (
            $requestData->status !== '申請中'
        ) {

            return response()->json([
                'message' =>
                    '申請中データのみ差戻できます'
            ], 400);
        }

        $requestData->status =
            '差戻';

        // 差戻理由を保存
        $requestData->reject_reason =
            $request->reason;

        $requestData->save();

        return response()->json([
            'message' => '差し戻しました'
        ]);
    }
}