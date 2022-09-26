<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReadinessQuestion extends Model
{

    protected $fillable = [
        "readiness_id",
        "question",
        "answer_options",
        "answer_type",
        "qustion_position",
        "qustion_type",
    ];

    public function readiness()
    {
        return $this->belongsTo('App\Readiness');
    }
}
