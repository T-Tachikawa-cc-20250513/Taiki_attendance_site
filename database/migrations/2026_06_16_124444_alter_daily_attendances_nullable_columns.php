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
        Schema::table(
            'daily_attendances',
            function (Blueprint $table) {

                $table->string('office')
                    ->nullable()
                    ->change();

                $table->time('start_time')
                    ->nullable()
                    ->change();

                $table->time('end_time')
                    ->nullable()
                    ->change();

                $table->time('break_start_time')
                    ->nullable()
                    ->change();

                $table->time('break_end_time')
                    ->nullable()
                    ->change();
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(
            'daily_attendances',
            function (Blueprint $table) {

                $table->string('office')
                    ->nullable(false)
                    ->change();

                $table->time('start_time')
                    ->nullable(false)
                    ->change();

                $table->time('end_time')
                    ->nullable(false)
                    ->change();

                $table->time('break_start_time')
                    ->nullable(false)
                    ->change();

                $table->time('break_end_time')
                    ->nullable(false)
                    ->change();
            }
        );
    }
};