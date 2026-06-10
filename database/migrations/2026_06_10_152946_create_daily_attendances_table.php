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
        Schema::create('daily_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->date('work_date');
            $table->string('work_type');
            $table->string('office');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('transportation_fee')->default(0);
            $table->text('remark')->nullable();
            $table->string('status')
                ->default('未申請');
            $table->text('manager_comment')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_attendances');
    }
};
