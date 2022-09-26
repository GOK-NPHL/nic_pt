<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReadinessAnswer extends Model
{
    protected $fillable = [
        "question_id",
        "answer",
        "laboratory_id",
        "user_id",
        "readiness_id"
    ];
}
