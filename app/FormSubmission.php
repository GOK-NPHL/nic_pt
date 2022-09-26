<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    protected $fillable = [
        "pt_shipment_id",
        "panel_receipt_date",
        "reporting_date",
        "tested_by",
        "submitted_by", // user_id?
        "user_id",
        "lab_id",
        "result",
    ];

    protected $casts = [
        "result" => "array",
    ];

}
