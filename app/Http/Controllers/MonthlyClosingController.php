<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\MonthlyClosing;

class MonthlyClosingController extends Controller
{
    /**
     * 月締実行
     */
    public function close(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $users = User::all();

        foreach ($users as $user) {

            MonthlyClosing::firstOrCreate(
                [
                    'user_id'      => $user->id,
                    'target_month' => $request->month,
                ],
                [
                    'closed_at' => now(),
                    'closed_by' => Auth::id(),
                ]
            );
        }

        return response()->json([
            'message' => "{$request->month} の月締を実施しました"
        ]);
    }
}