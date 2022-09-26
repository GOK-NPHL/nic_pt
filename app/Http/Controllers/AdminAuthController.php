<?php

namespace App\Http\Controllers;

use App\Admin;
use Illuminate\Http\Request;
use Auth;
use Exception;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class AdminAuthController extends Controller
{
    public function __construct()
    {
        // $this->middleware('guest:admin', ['except' => ['signOut']]);
        $this->middleware('auth:admin', ['except' => ['signOut', 'adminLogin', 'doLogin']]);
    }

    public function adminLogin()
    {
        return view('auth.admin_login');
    }

    public function doLogin(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',

        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::guard('admin')->attempt($credentials)) {
            return redirect()->route('admin-home');
        } else {
            return Redirect::back()->withErrors(['Email or Password incorrect']);
        }
        return redirect()->back()->withInput($request->only('email', 'remember'));
    }

    public function create(Request $request)
    {
        try {
            Admin::create([
                'name' => $request->user['name'],
                'email' => $request->user['email'],
                'phone_number' => $request->user['phone_number'],
                'is_admin' => 1,
                'password' => Hash::make($request->user['password'])
            ]);
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {

            return response()->json(['Message' => 'Could not save user ' . $ex->getMessage()], 500);
        }
    }

    public function edit(Request $request)
    {
        try {
            $admin = Admin::find($request->user['id']);
            $admin->name = $request->user['name'];
            $admin->email = $request->user['email'];
            $admin->phone_number = $request->user['phone_number'];
            $admin->is_admin = 1;

            if (!empty($request->user['password'])) {
                $admin->password = Hash::make($request->user['password']);
            }
            $admin->save();
            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {

            return response()->json(['Message' => 'Could not save user ' . $ex->getMessage()], 500);
        }
    }

    public function getAdminUser(Request $request)
    {
        try {
            if ($request->id == 'bad6b8cf97131fceab') {
                $user = FacadesAuth::user();
                return Admin::find($user->id);
            } else {
                return Admin::find($request->id);
            }
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch user: ' . $ex->getMessage()], 500);
        }
    }

    public function getAdminParticulars(Request $request)
    {

        try {
            $user = request()->user();
            
            $response = [
                'user' => $user,
            ];
            return response()->json($response);

        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting user details: ' . $ex->getMessage()], 500);
        }
    }

    public function signOut()
    {
        Auth::guard('admin')->logout();
        return redirect('index');
    }
}
