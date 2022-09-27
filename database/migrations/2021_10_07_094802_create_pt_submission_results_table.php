<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePtSubmissionResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pt_submission_results', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('ptsubmission_id');
            $table->integer('sample_id');
            // $table->integer("control_line")->nullable();
            // $table->integer("verification_line")->nullable();
            // $table->integer("longterm_line")->nullable();
            $table->string("interpretation")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pt_submission_results');
    }
}
