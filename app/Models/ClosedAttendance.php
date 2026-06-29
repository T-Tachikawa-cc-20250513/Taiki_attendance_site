<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClosedAttendance extends Model
{
    protected $fillable = [
        'user_id',
        'target_month',
        'work_date',
        'work_type',
        'office',
        'start_time',
        'end_time',
        'break_start_time',
        'break_end_time',
        'transportation_fee',
        'remark',
        'status',
        'manager_comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}