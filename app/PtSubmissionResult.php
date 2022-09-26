<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PtSubmissionResult extends Model
{
    protected $fillable = [
        "ptsubmission_id",
        "sample_id",
        // "control_line",
        // "verification_line",
        // "longterm_line",
        "interpretation"
    ];
}
