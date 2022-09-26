<?php

namespace App\Http\Controllers;

use App\Laboratory;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ParticipantController extends Controller
{
    public function getParticipants(Request $request)
    {
        try {
            return Laboratory::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch participants: ' . $ex->getMessage()], 500);
        }
    }

    public function getParticipant(Request $request)
    {
        try {
            return Laboratory::find($request->id);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch participants: ' . $ex->getMessage()], 500);
        }
    }

    public function createParticipant(Request $request)
    {

        try {
            Laboratory::create([
                'institute_name' => $request->lab['institute_name'],
                'email' => $request->lab['email'],
                'phone_number' => $request->lab['phone_number'],
                'is_active' => $request->lab['is_active'],
                'mfl_code' => $request->lab['mfl_code'],
                'facility_level' => $request->lab['facility_level'],
                'county' => $request->lab['county'],
                'lab_name' => $request->lab['lab_name'],
            ]);
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save participant: ' . $ex->getMessage()], 500);
        }
    }

    public function editParticipant(Request $request)
    {

        try {
            $lab = Laboratory::find($request->lab['id']);

            $lab->institute_name = $request->lab['institute_name'];
            $lab->email = $request->lab['email'];
            $lab->phone_number = $request->lab['phone_number'];
            $lab->is_active = $request->lab['is_active'];
            $lab->mfl_code = $request->lab['mfl_code'];
            $lab->facility_level = $request->lab['facility_level'];
            $lab->county = $request->lab['county'];
            $lab->lab_name = $request->lab['lab_name'];
            $lab->save();

            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update participant: ' . $ex->getMessage()], 500);
        }
    }

    public function createLabPersonel(Request $request)
    {
        try {
            $user = new User([
                'name' => $request->personel['first_name'],
                'second_name' => $request->personel['second_name'],
                'email' => $request->personel['email'],
                'phone_number' => $request->personel['phone_number'],
                'is_active' => $request->personel['is_active'],
                'password' => Hash::make($request->personel['password']),
                'has_qc_access' => $request->personel['has_qc_access'],
                'has_pt_access' => $request->personel['has_pt_access'],
            ]);
            $lab = Laboratory::find($request->personel['facility']);
            $lab->personel()->save($user);

            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save lab personel: ' . $ex->getMessage()], 500);
        }
    }

    public function editPersonel(Request $request)
    {

        try {

            $user = User::find($request->personel['id']);
            $user->name = $request->personel['first_name'];
            $user->second_name = $request->personel['second_name'];
            $user->email = $request->personel['email'];
            $user->phone_number = $request->personel['phone_number'];
            $user->is_active = $request->personel['is_active'];
            if (!empty($request->personel['password'])) {
                $user->password = Hash::make($request->personel['password']);
            }
            $user->has_qc_access = $request->personel['has_qc_access'];
            $user->has_pt_access = $request->personel['has_pt_access'];

            $lab = Laboratory::find($request->personel['facility']);
            $lab->personel()->save($user);

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update lab personel: ' . $ex->getMessage()], 500);
        }

    }

    public function getLabPersonel(Request $request)
    {
        try {

            $users = User::select(
                'users.id',
                'users.name',
                'users.email',
                'laboratories.lab_name',
                'users.has_qc_access',
                'users.phone_number',
                'users.has_pt_access',
                'users.is_active',
                'users.second_name'
            )->join('laboratories', 'laboratories.id', '=', 'users.laboratory_id')
                ->get();

            return $users;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch lab personel: ' . $ex->getMessage()], 500);
        }
    }

    public function getLabPersonelById(Request $request)
    {
        try {

            $users = User::select(
                'users.id',
                'users.name',
                'users.email',
                'laboratories.lab_name',
                'users.laboratory_id',
                'users.has_qc_access',
                'users.phone_number',
                'users.has_pt_access',
                'users.is_active',
                'users.second_name'
            )->join('laboratories', 'laboratories.id', '=', 'users.laboratory_id')
                ->where('users.id', '=', $request->id)
                ->get();

            return $users;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch lab personel: ' . $ex->getMessage()], 500);
        }
    }

    public function getParticipantDemographics(Request $request)
    {
        try {

            $userId = null;
            try {

                if ($request->id != 'null' && $request->id != 'undefined') {
                    $userId = $request->id;
                    
                } else {
                    $user = Auth::user();
                    $userId = $user->id;
                }
            } catch (Exception $ex) {
            };

            $usersDemo = User::select(
                'users.id as user_id',
                'users.name',
                'users.email as user_email',
                'laboratories.id as lab_id',
                'users.second_name',
                'users.phone_number as user_phone_number',
                'laboratories.lab_name',
                'laboratories.phone_number',
                'laboratories.mfl_code',
                'laboratories.email',

            )->join('laboratories', 'laboratories.id', '=', 'users.laboratory_id')
                ->where('users.id', '=', $userId)
                ->get();
            return $usersDemo;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not fetch users: ' . $ex->getMessage()], 500);
        }
    }

    public function editOwnPersonalBio(Request $request)
    {
        try {
            $user = User::find($request->personel['id']);
            $user->name = $request->personel['first_name'];
            $user->second_name = $request->personel['second_name'];
            $user->email = $request->personel['email'];
            $user->phone_number = $request->personel['phone_number'];
            if (!empty($request->personel['password'])) {
                $user->password = Hash::make($request->personel['password']);
            }
            $user->save();

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update bio: ' . $ex->getMessage()], 500);
        }
    }
}
