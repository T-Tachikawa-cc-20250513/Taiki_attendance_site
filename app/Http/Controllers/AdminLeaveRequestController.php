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
    public function index()
    {
        $requests = LeaveRequest::with(
            'user'
        )
        ->orderByDesc('created_at')
        ->get();

        return Inertia::render(
            'Admin/AdminLeaveRequest',
            [
                'requests' => $requests,
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

        $requestData->status =
            '承認済';

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

        $requestData->status =
            '差戻';

        $requestData->reject_reason =
            $request->reason;

        $requestData->save();

        return response()->json([
            'message' => '差し戻しました'
        ]);
    }
}