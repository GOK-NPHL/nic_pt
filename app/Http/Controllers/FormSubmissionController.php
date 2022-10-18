<?php

namespace App\Http\Controllers;

use App\FormSubmission;
use App\PtSample;
use App\PtSubmissionResult;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FormSubmissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('web');
    }


    ///////
    // public function participantSubmissions()
    // {
    // return view('user.pt.participant.submissionsList');
    // return view('user.pt.participant.submission');
    // }

    public function newParticipantSubmission()
    {
        return view('user.pt.participant.submission');
    }
    ///////

    // save the submission
    public function storeSubmission(Request $request)
    {
        try {
            $user = Auth::user();
            $request->validate([
                'pt_shipment_id' => 'required',
                'panel_receipt_date' => 'required',
                'reporting_date' => 'required',
                'tested_by' => 'required',
                'submitted_by' => 'required',
                'result' => 'required',
            ]);

            // check if the submission already exists for this shipment by this user
            $submission = FormSubmission::where('pt_shipment_id', $request->pt_shipment_id)
                ->where('user_id', $user->id)
                ->first();
            if ($submission) {
                Log::info('Submission already exists');
                return response()->json(['message' => 'Submission already exists'], 400);
            }

            $submission = FormSubmission::create([
                'pt_shipment_id' => $request->pt_shipment_id,
                'panel_receipt_date' => $request->panel_receipt_date,
                'reporting_date' => $request->reporting_date,
                'tested_by' => $request->tested_by,
                'submitted_by' => $request->submitted_by,
                'result' => $request->result,
                'user_id' => $user->id,
                'lab_id' => $user->laboratory_id,
            ]);

            // save the result_interpretation from the result json in the pt_submission_results table for each sample
            $samples = PtSample::where('ptshipment_id', $request->pt_shipment_id)->get();
            if ($samples) {
                foreach ($samples as $sample) {
                    $result = $request->interpretations;
                    $interpretation = $result[$sample->id]['interpretation'] ?? null;
                    PtSubmissionResult::create([
                        'ptsubmission_id' => $submission->id,
                        'sample_id' => $sample->id,
                        'interpretation' => $interpretation,
                    ]);
                }
            }
            

            dd($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Submission created successfully',
                'data' => $submission
            ], 200);
        }  catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Submission could not be created',
                'data' => $ex
            ], 500);
        }
    }

    // update
    public function updateSubmission(Request $request)
    {
        try {
            $submission = FormSubmission::find($request->submissionId);
            if (!$submission) {
                return response()->json([
                    'success' => false,
                    'message' => 'Submission not found',
                    'data' => null
                ], 404);
            }
            $submission->update([
                'panel_receipt_date' => $request->panel_receipt_date,
                // 'reporting_date' => $request->reporting_date,
                'tested_by' => $request->tested_by,
                'submitted_by' => $request->submitted_by,
                'result' => $request->result,
            ]);

            $samples = PtSample::where('ptshipment_id', $request->pt_shipment_id)->get();
            if ($samples) {
                foreach ($samples as $sample) {
                    $result = $request->interpretations;
                    $interpretation = $result[$sample->id]['interpretation'] ?? null;
                    PtSubmissionResult::create([
                        'ptsubmission_id' => $submission->id,
                        'sample_id' => $sample->id,
                        'interpretation' => $interpretation,
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Submission updated successfully',
                'data' => $submission
            ], 200);
        }  catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Submission could not be updated',
                'data' => $ex
            ], 500);
        }
    }

    public function getSubmission(Request $request)
    {
        try {
            $id = $request->id;
            $submission = FormSubmission::where('id', $id, 'deleted_at', null)->first();
            return response()->json([
                'success' => true,
                'message' => 'Submission retrieved successfully',
                'data' => $submission
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Submission could not be retrieved',
                'data' => $ex
            ], 500);
        }
    }

    public function getAllSubmissions()
    {
        try {
            $submissions = FormSubmission::where('deleted_at', null)->get();
            return response()->json([
                'success' => true,
                'message' => 'Submissions retrieved successfully',
                'data' => $submissions
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Submissions could not be retrieved',
                'data' => $ex
            ], 500);
        }
    }

    public function getUserSubmissionsByShipment(Request $request)
    {
        try {
            $user = Auth::user();
            $id = $request->id;
            $submissions = FormSubmission::where('pt_shipment_id', $id, 'user_id', $user->id, 'deleted_at', null)->get();
            return response()->json([
                'success' => true,
                'message' => 'Submissions retrieved successfully',
                'data' => $submissions
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Submissions could not be retrieved',
                'data' => $ex
            ], 500);
        }
    }

    public function getAllSubmissionsByShipment(Request $request)
    {
        try {
            $id = $request->id;
            $submissions = FormSubmission::where('pt_shipment_id', $id, 'deleted_at', null)->get();
            return response()->json([
                'success' => true,
                'message' => 'Submissions retrieved successfully',
                'data' => $submissions
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Submissions could not be retrieved',
                'data' => $ex
            ], 500);
        }
    }

    public function getAllSubmissionsByLab(Request $request)
    {
        try {
            $id = $request->id;
            $submissions = FormSubmission::where('lab_id', $id, 'deleted_at', null)->get();
            return response()->json([
                'success' => true,
                'message' => 'Submissions retrieved successfully',
                'data' => $submissions
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Submissions could not be retrieved',
                'data' => $ex
            ], 500);
        }
    }

    public function getAllSubmissionsByUser(Request $request)
    {
        try {
            $id = $request->id;
            $submissions = FormSubmission::where('user_id', $id, 'deleted_at', null)->get();
            return response()->json([
                'success' => true,
                'message' => 'Submissions retrieved successfully',
                'data' => $submissions
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Submissions could not be retrieved',
                'data' => $ex
            ], 500);
        }
    }
}
