<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','laboratory_id','has_qc_access','has_pt_access','second_name','phone_number','is_active'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function OdkOrgunit()
    {
        return $this->belongsToMany('App\OdkOrgunit','odkorgunit_user');
    }

    public function rolesCreated()
    {
        return $this->hasMany('App\Role', 'editor_id');
    }

    public function laboratory()
    {
        return $this->belongsTo('Laboratory');
    }

    public function lab(){
        $lab = Laboratory::where('id',$this->laboratory_id)->first();
        return $lab;
    }
}
