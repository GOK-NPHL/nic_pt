<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReadinessQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('readiness_questions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('readiness_id');
            $table->string('question');
            $table->string('answer_options')->nullable();
            $table->string('answer_type')->nullable();
            $table->integer('qustion_position');
            $table->string('qustion_type');
        });

        // Schema::table('readiness_questions', function ($table) {
        //     $table->foreign('readiness_id')
        //         ->references('id')->on('readinesses')
        //         ->onDelete('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('readiness_questions');
    }
}
