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
        Schema::create('closed_attendances', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('target_month');

            $table->date('work_date');

            $table->string('work_type')->nullable();
            $table->string('office')->nullable();

            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            $table->time('break_start_time')->nullable();
            $table->time('break_end_time')->nullable();

            $table->integer('transportation_fee')->default(0);

            $table->text('remark')->nullable();

            $table->string('status')->default('未申請');

            $table->text('manager_comment')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('closed_attendances');
    }
};
