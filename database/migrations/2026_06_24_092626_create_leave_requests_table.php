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
            'leave_requests',
            function (Blueprint $table) {

                $table->id();

                // 申請者
                $table->foreignId('user_id')
                    ->constrained()
                    ->cascadeOnDelete();

                // 申請区分
                $table->string('request_type');

                // 対象期間
                $table->date('start_date');
                $table->date('end_date')->nullable();

                // 理由
                $table->text('reason');

                // 添付ファイル
                $table->string('attachment_path')
                    ->nullable();

                // ステータス
                $table->string('status')
                    ->default('未申請');

                // 管理者コメント
                $table->text('manager_comment')
                    ->nullable();

                // 承認者
                $table->foreignId('approved_by')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();

                // 承認日時
                $table->timestamp('approved_at')
                    ->nullable();

                $table->timestamps();
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(
            'leave_requests'
        );
    }
};