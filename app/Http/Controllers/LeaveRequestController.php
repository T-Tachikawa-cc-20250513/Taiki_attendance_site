<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\LeaveRequest;

class LeaveRequestController extends Controller
{
    /**
     * ユーザー：届出一覧
     */
    public function index(Request $request)
    {
        $status = $request->status ?? '申請中';

        $leaveRequests = LeaveRequest::where(
            'user_id',
            Auth::id()
        )
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
            'LeaveRequest/Index',
            [
                'leaveRequests' => $leaveRequests,
                'status'        => $status,
            ]
        );
    }

    /**
     * ユーザー：届出作成画面
     */
    public function create()
    {
        return Inertia::render(
            'LeaveRequest/Create'
        );
    }

    /**
     * ユーザー：保存（未申請）
     */
    public function store(Request $request)
    {
        $request->validate([
            'request_type' => 'required|string',
            'start_date'   => 'required|date',
            'reason'       => 'required|string',
            'image'        => 'nullable|image|max:2048',
        ]);

        $attachmentPath = null;

        if ($request->hasFile('image')) {

            $attachmentPath = $request
                ->file('image')
                ->store(
                    'leave_requests',
                    'public'
                );
        }

        LeaveRequest::create([
            'user_id'         => Auth::id(),
            'request_type'    => $request->request_type,
            'start_date'      => $request->start_date,
            'reason'          => $request->reason,
            'attachment_path' => $attachmentPath,
            'status'          => '未申請',
        ]);

        return response()->json([
            'message' => '保存しました'
        ]);
    }

    /**
     * ユーザー：申請
     */
    public function apply(Request $request)
    {
        $request->validate([
            'request_type' => 'required|string',
            'start_date'   => 'required|date',
            'reason'       => 'required|string',
            'image'        => 'nullable|image|max:2048',
        ]);

        $attachmentPath = null;

        if ($request->hasFile('image')) {

            $attachmentPath = $request
                ->file('image')
                ->store(
                    'leave_requests',
                    'public'
                );
        }

        LeaveRequest::create([
            'user_id'         => Auth::id(),
            'request_type'    => $request->request_type,
            'start_date'      => $request->start_date,
            'reason'          => $request->reason,
            'attachment_path' => $attachmentPath,
            'status'          => '申請中',
        ]);

        return redirect('/leave-requests');
    }

    /**
     * ユーザー：申請取消
     */
    public function cancel($id)
    {
        $leaveRequest = LeaveRequest::where(
            'user_id',
            Auth::id()
        )->findOrFail($id);

        if ($leaveRequest->status !== '申請中') {

            return response()->json([
                'message' => '取消できません'
            ], 400);
        }

        $leaveRequest->status = '未申請';

        $leaveRequest->save();

        return response()->json([
            'message' => '申請を取消しました'
        ]);
    }

    /**
     * 管理者：届出一覧
     */
    public function adminIndex()
    {
        $leaveRequests = LeaveRequest::with(
            'user'
        )
        ->orderByDesc('created_at')
        ->get();

        return Inertia::render(
            'Admin/LeaveRequestList',
            [
                'leaveRequests' => $leaveRequests,
            ]
        );
    }

    /**
     * 管理者：届出詳細
     */
    public function adminShow($id)
    {
        $leaveRequest = LeaveRequest::with(
            'user'
        )->findOrFail($id);

        return Inertia::render(
            'Admin/LeaveRequestDetail',
            [
                'leaveRequest' => $leaveRequest,
            ]
        );
    }

    /**
     * 管理者：承認
     */
    public function approve($id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);

        if ($leaveRequest->status !== '申請中') {

            return response()->json([
                'message' => '申請中データのみ承認できます'
            ], 400);
        }

        $leaveRequest->status = '承認済';
        $leaveRequest->manager_comment = null;
        $leaveRequest->approved_by = Auth::id();
        $leaveRequest->approved_at = now();

        $leaveRequest->save();

        return response()->json([
            'message' => '承認しました'
        ]);
    }

    /**
     * 管理者：差戻
     */
    public function reject(
        Request $request,
        $id
    ) {
        $request->validate([
            'comment' => 'required|string',
        ]);

        $leaveRequest = LeaveRequest::findOrFail($id);

        if ($leaveRequest->status !== '申請中') {

            return response()->json([
                'message' => '申請中データのみ差戻できます'
            ], 400);
        }

        $leaveRequest->status = '差戻';
        $leaveRequest->manager_comment =
            $request->comment;

        $leaveRequest->save();

        return response()->json([
            'message' => '差戻しました'
        ]);
    }
}