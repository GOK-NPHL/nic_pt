<?php

namespace App\Http\Controllers;

use App\Laboratory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use Auth;
use Hash;
use Session;
use App\User;
use Facade\FlareClient\View;
use Illuminate\Contracts\Session\Session as SessionSession;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session as FacadesSession;

class CustomAuthController extends Controller

{

    public function index()
    {   
        return view('home_page');
    }

    public function getParticipantLoginPage()
    {
        return view('auth.participant_login');//->with('message', 'You are logged out');
    }
    public function getParticipantSignupPage()
    {
        return view('auth.participant_signup')->with('laboratories', Laboratory::all());
    }

    public function doLogin(Request $request)
    {
        // $request->validate([
        //     'email' => 'required',
        //     'password' => 'required',
        // ]);
        // Log::info($request);
        // $credentials = $request->only('email', 'password');
        // if (Auth::attempt($credentials)) {
        //     return redirect()->route('participant-home');
        // } else {
        //     return Redirect::back()->withErrors(['Email or Password incorrect']);
        // }

        // return redirect()->route('login')->withSuccess('Login details are not valid');


        $request->validate([
            'email' => 'required',
            'password' => 'required',

        ]);

        $credentials = $request->only('email', 'password');
        Log::info($credentials);
        if (Auth::attempt($credentials)) {
            Log::info($request);
            return redirect()->route('participant-home');
        } else {
            Log::info("refuse == >>");
            return Redirect::back()->withErrors(['Email or Password incorrect']);
        }
        // return redirect()->back()->withInput($request->only('email', 'remember'));

    }


    


    public function doSignup(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'user_type' => 'required',
            'fname' => 'required',
            'lname' => 'required',
            'email' => 'required',
            'laboratory' => 'required',
            'password' => 'required',
            'password_repeat' => 'required'
        ]);

        // check if user exists
        $user = User::where('email', $request->email)->first();
        if ($user) {
            return Redirect::back()->withErrors(['User with this email already exists']);
        }
        //check if passwords match
        if ($request->password != $request->password_repeat) {
            return Redirect::back()->withErrors(['Passwords do not match']);
        }
        // check password length
        if (strlen($request->password) < 6) {
            return Redirect::back()->withErrors(['Password must be at least 6 characters long']);
        }
        // check password strength
        if (!preg_match("#[0-9]+#", $request->password) || !preg_match("#[a-zA-Z]+#", $request->password)) {
            return Redirect::back()->withErrors(['Password must contain at least one letter and one number']);
        }
        // check if user type is valid
        if ($request->user_type != 'participant') {
            return Redirect::back()->withErrors(['User type is not valid']);
        }
        // check if laboratory exists
        $laboratory = Laboratory::where('id', $request->laboratory)->first();
        if (!$laboratory) {
            return Redirect::back()->withErrors(['Laboratory does not exist']);
        }
        try {
            $user = new User;
            $user->name = $request->fname;
            $user->second_name = $request->lname;
            // $user->laboratory_id = Laboratory::where('institute_name', 'like', '%demo%')->first()->id ?? 8;
            $user->laboratory_id = $request->laboratory;
            $user->email = $request->email;
            $user->phone_number = $request->phone;
            $user->password = Hash::make($request->password);
            $user->is_active = 1;
            $user->has_qc_access = 1;
            $user->has_pt_access = 1;
            // $user->roles = [Role::where('slug', 'like', '%guest%')->first()->id];
            $user->save();
            return redirect()->route('participant-login')->with('message', 'Account created successfully. Please login');
        } catch (\Exception $e) {
            // show log if env is development
            $msg = 'Error creating user';
            if (env('APP_ENV') != 'production') {
                $msg = $msg . ': ' . $e->getMessage();
            }
            return Redirect::back()->withErrors([$msg]);
        }
    }


    public function registration()
    {
        return view('auth.registration');
    }


    public function customRegistration(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $data = $request->all();
        $check = $this->create($data);

        return redirect("home")->withSuccess('You have signed-in');
    }


    public function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);
    }

    public function signOut()
    {
        Session::flush();
        Auth::logout();

        return Redirect()->route('index');
    }
}
