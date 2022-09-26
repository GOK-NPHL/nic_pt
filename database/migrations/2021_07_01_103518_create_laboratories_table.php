<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLaboratoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('laboratories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('institute_name');
            $table->string('email');
            $table->boolean('is_active');
            $table->string('lab_name');
            $table->integer('mfl_code');
            $table->string('phone_number');
            $table->string('facility_level');
            $table->string('county');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('laboratories');
    }
}
