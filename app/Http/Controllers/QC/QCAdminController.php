<?php

namespace App\Http\Controllers\QC;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QCAdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

        $this->middleware('auth:admin');
    }


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function adminHome()
    {
        return view('user.system.admin.dashboard');
    }

    public function addUser()
    {
        return view('user.system.admin.add_user');
    }

    public function editUser()
    {
        return view('user.system.admin.edit_user');
    }

    public function addLab()
    {
        return view('user.system.admin.add_lab');
    }

    public function editLab()
    {
        return view('user.system.admin.edit_lab');
    }

    public function addPersonel()
    {
        return view('user.system.admin.add_personel');
    }
    public function editPersonel()
    {
        return view('user.system.admin.edit_personel');
    }

    public function listUser()
    {
        return view('user.system.admin.list_user');
    }

    public function listLab()
    {
        return view('user.system.admin.list_lab');
    }

    public function listPersonel()
    {
        return view('user.system.admin.list_personel');
    }
}
