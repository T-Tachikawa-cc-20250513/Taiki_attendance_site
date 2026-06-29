<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(
            'monthly_closings',
            function (Blueprint $table) {

                $table->id();

                // ユーザーID
                $table->foreignId('user_id')
                    ->constrained()
                    ->cascadeOnDelete();

                // 対象年月（2026-06 のような形式）
                $table->string('target_month');

                // 月締日時
                $table->timestamp('closed_at');

                // 月締を行った管理者
                $table->foreignId('closed_by')
                    ->constrained('users');

                $table->timestamps();

                // 同じユーザー・同じ月は1件のみ
                $table->unique([
                    'user_id',
                    'target_month',
                ]);
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(
            'monthly_closings'
        );
    }
};