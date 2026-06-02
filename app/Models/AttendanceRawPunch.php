<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceRawPunch extends Model
{
    protected $fillable = [
        'user_id',
        'punch_type',
        'punched_at',
        'latitude',
        'longitude',
        'source',
    ];
}
