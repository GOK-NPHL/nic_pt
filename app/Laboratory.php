<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Laboratory extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'institute_name',
        'is_active',
        'mfl_code',
        'phone_number',
        'lab_name',
        'facility_level',
        'county'
    ];

    public function personel()
    {
        return $this->hasMany('\App\User');
    }

    public function ptshipement()
    {
        return $this->belongsToMany('\App\PtShipement');
    }

    public function readiness()
    {
        return $this->belongsToMany('App\Readiness');
    }
}
