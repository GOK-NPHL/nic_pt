<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ptsubmission extends Model
{
    protected $fillable = [
        "testing_date",
        "kit_date_received",
        "pt_shipements_id",
        "lot_date_received",
        "kit_expiry_date",
        "kit_lot_no",
        "pt_shipements_id",
        "name_of_test",
        "pt_lot_no",
        "sample_reconstituion_date",
        "test_justification",
        "pt_tested",
        "not_test_reason",
        "other_not_tested_reason",
        "lab_id",
        "user_id",
        "sample_type",
        "tester_name"
    ];
}
