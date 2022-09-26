<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ptsubmissions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->integer("pt_shipements_id");
            $table->date("testing_date");
            $table->string("name_of_test");
            $table->string("kit_lot_no");
            $table->date("kit_date_received");
            $table->date("kit_expiry_date");

            $table->string("pt_lot_no");
            $table->date("lot_date_received");
            $table->date("sample_reconstituion_date");
            $table->integer("lab_id");
            $table->integer("user_id");
            $table->string("sample_type");
            $table->string("test_justification");

            $table->integer("pt_tested");
            $table->string("not_test_reason")->nullable();;
            $table->string("other_not_tested_reason")->nullable();
            $table->string("tester_name")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ptsubmissions');
    }
}
