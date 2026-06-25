<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use Inertia\Inertia;

class AdminLeaveRequestController extends Controller
{
    /**
     * 届出一覧画面
     */
    public function index(Request $request)
    {
        $userId = $request->userId;

        $requests = LeaveRequest::with('user')
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render(
            'Admin/AdminLeaveRequestList',
            [
                'requests' => $requests,
                'userId'   => $userId,
            ]
        );
    }

    /**
     * 承認
     */
    public function approve($id)
    {
        $requestData =
            LeaveRequest::findOrFail($id);

        if (
            $requestData->status !== '申請中'
        ) {

            return response()->json([
                'message' =>
                    '申請中データのみ承認できます'
            ], 400);
        }

        $requestData->status =
            '承認済';

        // 差戻理由をクリア
        $requestData->reject_reason =
            null;

        $requestData->save();

        return response()->json([
            'message' => '承認しました'
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