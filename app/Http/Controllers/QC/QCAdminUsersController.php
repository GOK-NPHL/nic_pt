<?php

namespace App\Http\Controllers\QC;

use App\Admin;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;

class QCAdminUsersController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function getAdminUsers(Request $request)
    {
        try {
            return Admin::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch users: ' . $ex->getMessage()], 500);
        }
    }
}
