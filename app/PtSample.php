<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PtSample extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'reference_result',
        'ptshipment_id'

    ];

    public function ptshipment()
    {
        return $this->belongsTo('App\PtShipement');
    }
}
