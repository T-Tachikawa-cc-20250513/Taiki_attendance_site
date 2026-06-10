<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyAttendance extends Model
{
    protected $fillable = [
        'user_id',
        'work_date',
        'work_type',
        'office',
        'start_time',
        'end_time',
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