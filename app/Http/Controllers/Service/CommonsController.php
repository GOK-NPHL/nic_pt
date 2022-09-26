<?php

namespace App\Http\Controllers\Service;

use App\County;
use App\Http\Controllers\Controller;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommonsController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:sanctum');
    }

    public function getCounties()
    {

        try {
            return County::all();
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting counties: ' . $ex->getMessage()], 500);
        }
    }


    public function getUserId()
    {

        try {
            $user = Auth::user();
            $userId = $user->id;
            return ['user_id' => $userId];
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting user ID: ' . $ex->getMessage()], 500);
        }
    }
    public function getUserParticulars(Request $request)
    {

        try {
            $user = request()->user();
            $user = User::find($user->id);
            $user_id = $user->id;
            $user_name = $user->name . ' ' . $user->second_name;
            $user_email = $user->email;
            
            $response = [
                'user' => $user,
                'id' => $user_id,
                'name' => $user_name,
                'email' => $user_email,
            ];
            return response()->json($response);

        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting user details: ' . $ex->getMessage()], 500);
        }
    }
}
