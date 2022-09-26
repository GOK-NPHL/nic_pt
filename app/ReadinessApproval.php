<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReadinessApproval extends Model
{

    protected $fillable = [
        "approved",
        "readiness_id",
        "lab_id",
        "admin_id",

    ];
}
