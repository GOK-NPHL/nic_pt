<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRequiredFieldReadinessquestion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('readiness_questions', function (Blueprint $table) {
            $table->boolean('is_required')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('readiness_questions', function (Blueprint $table) {
            $table->dropColumn('is_required');
        });
    }
}
