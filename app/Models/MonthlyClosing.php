<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyClosing extends Model
{
    protected $fillable = [
        'user_id',
        'target_month',
        'closed_at',
        'closed_by',
    ];

    protected $casts = [
        'closed_at' => 'datetime',
    ];

    /**
     * 対象ユーザー
     */
    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    /**
     * 月締実施者（管理者）
     */
    public function closer()
    {
        return $this->belongsTo(
            User::class,
            'closed_by'
        );
    }
}