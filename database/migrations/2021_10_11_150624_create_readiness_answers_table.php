<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReadinessAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('readiness_answers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer("readiness_id");
            $table->integer("question_id");
            $table->integer("laboratory_id");
            $table->integer("user_id");
            $table->string("answer");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('readiness_answers');
    }
}
