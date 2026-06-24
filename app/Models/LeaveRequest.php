<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'request_type',
        'start_date',
        'end_date',
        'reason',
        'attachment_path',
        'status',
        'manager_comment',
        'approved_by',
        'approved_at',
    ];

    /**
     * 申請者
     */
    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    /**
     * 承認者
     */
    public function approver()
    {
        return $this->belongsTo(
            User::class,
            'approved_by'
        );
    }
}