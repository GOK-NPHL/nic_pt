<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReadinessApprovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('readiness_approvals', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer("approved");
            $table->integer("readiness_id");
            $table->integer("lab_id");
            $table->integer("admin_id");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('readiness_approvals');
    }
}
