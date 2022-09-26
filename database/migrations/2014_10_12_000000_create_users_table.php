<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('second_name');
            $table->string('email')->unique();
            $table->unsignedBigInteger('laboratory_id');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone_number');
            $table->boolean('has_qc_access');
            $table->boolean('has_pt_access');
            $table->boolean('is_active');
            $table->rememberToken();
            $table->timestamps();
        });

        // Schema::table('users', function ($table) {
        //     $table->foreign('laboratory_id')
        //         ->references('id')->on('laboratories')
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
        Schema::dropIfExists('users');
    }
}
