<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Laboratory;
use App\PtSample;
use App\PtShipement;
use App\Readiness;
use App\ReadinessQuestion;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PTShipmentController extends Controller
{

    public function getShipments(Request $request)
    {

        try {

            $readinessesWithLabId = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(*) as participant_count')
            )->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
                ->groupBy(
                    "pt_shipements.id",
                    'pt_shipements.round_name',
                    'pt_shipements.readiness_id',
                    "pt_shipements.updated_at",
                    "pt_shipements.pass_mark",
                    "pt_shipements.code",
                );

            $readinessesWithNullLabId = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(*) as participant_count')
            )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->groupBy('laboratory_pt_shipement.pt_shipement_id');


            $finalQuery = $readinessesWithLabId->union($readinessesWithNullLabId)->orderBy('last_update', 'desc')->get();

            return $finalQuery;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipmentById(Request $request)

    {

        try {
            $labIds = [];
            $shipment = PtShipement::find($request->id);

            //get participants
            if (empty($shipment->readiness_id)) {

                $labs = PtShipement::select(
                    "laboratory_pt_shipement.laboratory_id"
                )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                    ->where('id', $request->id)
                    ->get();
                $labIds = [];
                foreach ($labs as $lab) {
                    $labIds[] = $lab->laboratory_id;
                }
            }

            //get samples
            $ptSamples = PtSample::select(
                "pt_samples.id",
                "name",
                "reference_result"
            )->join('pt_shipements', 'pt_shipements.id', '=', 'pt_samples.ptshipment_id')
                ->where('pt_shipements.id', $request->id)
                ->get();

            $payload = [];
            $payload['shipment'] = $shipment;
            $payload['labs'] = $labIds;
            $payload['samples'] = $ptSamples;

            return $payload;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch shipment: ' . $ex->getMessage()], 500);
        }
    }


    public function saveShipment(Request $request)
    {
        try {

            $shipments = PtShipement::where('round_name', $request->shipement['round'])->get();
            if (count($shipments) > 0) {
                return response()->json(['Message' => 'Error during creating shipment. Round name already exist '], 500);
            }

            if (empty($request->shipement['readiness_id']) && count($request->shipement['selected']) == 0) {
                return response()->json(['Message' => 'Please select checklist of participants for this shipment '], 500);
            }

            $participantsList = [];

            if (empty($request->shipement['readiness_id'] == true)) {

                $participantsList = $request->shipement['selected'];
            }

            $shipment = PtShipement::create([
                'pass_mark' => $request->shipement['pass_mark'],
                'round_name' => $request->shipement['round'],
                'code' => $request->shipement['shipment_code'],
                'end_date' => $request->shipement['result_due_date'],
                'test_instructions' => $request->shipement['test_instructions'],
                'readiness_id' => (empty($request->shipement['readiness_id']) ? null : $request->shipement['readiness_id'])
            ]);

            //save participants
            $shipment->laboratories()->attach($participantsList);

            // Save questions
            foreach ($request->shipement['samples'] as $sample) {
                $ptSample = new PtSample();

                $ptSample->name = $sample['name'];
                $ptSample->reference_result = $sample['reference_result'];
                $ptSample->ptshipment()->associate($shipment);
                $ptSample->save();
            }

            // Save laboratiories
            // $readiness->laboratories()->attach($request->shipement['participants']);
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }


    public function updateShipment(Request $request)
    {

        try {

            $shipments = PtShipement::find($request->shipement['id']);

            if (empty($request->shipement['readiness_id']) && count($request->shipement['selected']) == 0) {
                return response()->json(['Message' => 'Please select checklist of participants for this shipment '], 500);
            }

            $participantsList = [];

            if (empty($request->shipement['readiness_id'] == true)) {

                $participantsList = $request->shipement['selected'];
            }

            $shipments->pass_mark = $request->shipement['pass_mark'];
            $shipments->round_name = $request->shipement['round'];
            $shipments->code = $request->shipement['shipment_code'];
            $shipments->end_date = $request->shipement['result_due_date'];
            $shipments->test_instructions = $request->shipement['test_instructions'];
            $shipments->readiness_id = (empty($request->shipement['readiness_id']) ? null : $request->shipement['readiness_id']);

            $shipments->save();

            // save participants

            $shipments->laboratories()->sync($participantsList);

            // Save samples
            $existingSampls = PtSample::select("id")->where('ptshipment_id', $request->shipement['id'])
                ->pluck('id')->toArray();
            //          $
            $updatedIds = [];
            foreach ($request->shipement['samples'] as $sample) {
                try {

                    $ptSample = null;
                    try {
                        $ptSample =  PtSample::find($sample['id']);
                    } catch (Exception $ex) {
                        $ptSample = new PtSample();
                    }

                    $ptSample->name = $sample['name'];
                    $ptSample->reference_result = $sample['reference_result'];
                    $ptSample->ptshipment()->associate($shipments);
                    $ptSample->save();
                } catch (Exception $ex) {
                }
            }
            //delete samples not in the new list
            for ($x = 0; $x < count($existingSampls); $x++) {
                if (!in_array($existingSampls[$x], $updatedIds)) {
                    //PtSample::find($sample['id'])->delete();
                }
            }

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    public function getUserSamples(Request $request)
    {
        $user = Auth::user();

        // try {

        $shipments = PtShipement::select( //when using labs
            "pt_shipements.id",
            "pt_shipements.id as pt_shipements_id",
            "pt_shipements.round_name",
            "pt_shipements.code",
            "pt_shipements.start_date",
            "pt_shipements.end_date",
            "pt_shipements.test_instructions",
            "pt_samples.id as sample_id",
            "pt_samples.name as sample_name",
            "ptsubmissions.id as submission_id",
            "form_submissions.id as form_submission_id",
            DB::raw("1 as is_readiness_answered"),
            DB::raw("null as readiness_id"),
            DB::raw("1 as readiness_approval_id")

        )
            ->leftJoin('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
            ->leftJoin('form_submissions', 'pt_shipements.id', '=', 'form_submissions.pt_shipment_id')
            ->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
            ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
            ->join('laboratories', 'laboratory_pt_shipement.laboratory_id', '=', 'laboratories.id')
            ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
            ->where('users.id', $user->id);

        $shipments2 = PtShipement::select( //when using readiness
            "pt_shipements.id",
            "pt_shipements.id as pt_shipements_id",
            "pt_shipements.round_name",
            "pt_shipements.code",
            "pt_shipements.start_date",
            "pt_shipements.end_date",
            "pt_shipements.test_instructions",
            "pt_samples.id as sample_id",
            "pt_samples.name as sample_name",
            "ptsubmissions.id as submission_id",
            "form_submissions.id as form_submission_id",
            "readiness_answers.id as is_readiness_answered", //check if readiness for this shipment id filled
            "pt_shipements.readiness_id as readiness_id",
            "readiness_approvals.id as readiness_approval_id"
        )

            ->leftJoin('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
            ->leftJoin('form_submissions', 'pt_shipements.id', '=', 'form_submissions.pt_shipment_id')
            ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
            ->leftJoin('readiness_answers',  'laboratory_readiness.readiness_id', '=',  'readiness_answers.readiness_id')
            ->leftJoin('readiness_approvals', 'readiness_answers.laboratory_id', '=',  'readiness_approvals.lab_id')
            ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
            ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
            ->join('users', 'users.laboratory_id', '=', 'laboratories.id')

            ->where('users.id', $user->id)
            ->union($shipments)
            // ->orderBy('pt_shipements.end_date')
            ->get();

        $payload = [];
        $sampleIds = [];

        foreach ($shipments2 as $lab) {

            if ($lab->round_name == "round 20") {
                // Log::info($lab);
            }
            if (array_key_exists($lab->id, $payload)) {
                if (!array_key_exists($lab->sample_id, $sampleIds)) {
                    $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];
                    $sampleIds[$lab->sample_id] = 1;
                }
            } else {

                if (!array_key_exists($lab->sample_id, $sampleIds)) {
                    $sampleIds[$lab->sample_id] = 1;
                    $payload[$lab->id] = [];
                    $payload[$lab->id]['samples'] = [];
                    $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];

                    $payload[$lab->id]['test_instructions'] = $lab->test_instructions;
                    $payload[$lab->id]['id'] = $lab->id;
                    $payload[$lab->id]['pt_shipements_id'] = $lab->pt_shipements_id;
                    $payload[$lab->id]['start_date'] = $lab->start_date;
                    $payload[$lab->id]['code'] = $lab->code;
                    $payload[$lab->id]['end_date'] = $lab->end_date;
                    $payload[$lab->id]['round_name'] = $lab->round_name;
                    $payload[$lab->id]['submission_id'] = $lab->submission_id;
                    $payload[$lab->id]['form_submission_id'] = $lab->form_submission_id;
                    $payload[$lab->id]['is_readiness_answered'] = $lab->is_readiness_answered;
                    $payload[$lab->id]['readiness_id'] = $lab->readiness_id;
                    $payload[$lab->id]['readiness_approval_id'] = $lab->readiness_approval_id;
                }
            }
        }

        // if a shipment id has been passed, return only that shipment
        if ($request->has('shipment_id')) {
            $shipment_id = $request->input('shipment_id');
            if (array_key_exists($shipment_id, $payload)) {
                return response()->json($payload[$shipment_id]);
            } else {
                return response()->json(['Message' => 'No data found matching the given shipment ID'], 404);
            }
        }

        return $payload;
        // } catch (Exception $ex) {
        //     Log::error($ex);
        //     return response()->json(['Message' => 'Could fetch samples: ' . $ex->getMessage()], 500);
        // }
    }
    /////

    public function getShipmentResponsesById(Request $request)
    {
        $user = Auth::user();
        try {

            $shipmentsResponses = DB::table("pt_shipements")->distinct()
                // ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('form_submissions', 'form_submissions.pt_shipment_id', '=', 'pt_shipements.id')
                ->join('laboratories', 'form_submissions.lab_id', '=', 'laboratories.id')
                ->join('users', 'form_submissions.user_id', '=', 'users.id')
                ->where('pt_shipements.id', $request->id)
                ->get([
                    "pt_shipements.id",
                    "pt_shipements.start_date",
                    "pt_shipements.code",
                    "pt_shipements.end_date",
                    "pt_shipements.round_name as name",
                    "laboratories.id as lab_id",
                    "users.name as fname",
                    "users.second_name as sname",
                    "laboratories.phone_number",
                    "laboratories.lab_name",
                    "laboratories.email",
                    "form_submissions.id as ptsubmission_id",
                    "form_submissions.created_at",
                    "form_submissions.updated_at",
                ]);

            return $shipmentsResponses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch submissions list: ' . $ex->getMessage()], 500);
        }
    }


    public function getShipmentResponseReport($id,  $is_part)
    {
        $user = Auth::user();
        try {

            $shipmentsResponses = DB::table("pt_shipements")->distinct()
                // ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('form_submissions', 'form_submissions.pt_shipment_id', '=', 'pt_shipements.id')
                ->join('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'form_submissions.id')
                ->join('laboratories', 'form_submissions.lab_id', '=', 'laboratories.id')
                ->join('users', 'form_submissions.user_id', '=', 'users.id');

            if ($is_part == 1) {
                $shipmentsResponses = $shipmentsResponses->where('form_submissions.lab_id', $user->laboratory_id)
                    ->where('form_submissions.pt_shipment_id', $id);
            } else {
                $shipmentsResponses = $shipmentsResponses->where('form_submissions.id', $id);
            }

            $shipmentsResponses = $shipmentsResponses->get([
                "pt_shipements.id",
                "pt_shipements.created_at as shipment_date",
                "pt_shipements.code",
                "pt_shipements.end_date",
                "pt_shipements.round_name as name",
                "laboratories.id as lab_id",
                "users.name as fname",
                "users.second_name as sname",
                "laboratories.phone_number",
                "laboratories.lab_name",
                "laboratories.email",
                "form_submissions.id as ptsubmission_id",
                "form_submissions.created_at as _first_submission_date",
                "form_submissions.updated_at  as update_submission_date",
                "form_submissions.testing_date",
                // "ptsubmissions.kit_expiry_date",
                // "ptsubmissions.kit_date_received",
                // "ptsubmissions.pt_lot_no",
            ]);


            //  one
            $hipmentsRefResult = DB::table("pt_shipements")->distinct()
                ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id');

            $hipmentsRefResult = $hipmentsRefResult->get([
                "pt_samples.reference_result as reference_result",
                "pt_samples.name as sample_name"
            ]);


            //  two
            $shipmentsResponsesRlt = DB::table("pt_shipements")->distinct()
                // ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('form_submissions', 'form_submissions.pt_shipment_id', '=', 'pt_shipements.id')
                ->leftJoin('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'form_submissions.id')
                ->join('pt_samples', 'pt_samples.id', '=', 'pt_submission_results.sample_id');
            if ($is_part == 1) {
                $shipmentsResponsesRlt = $shipmentsResponsesRlt->where('form_submissions.lab_id', $user->laboratory_id)
                    ->where('form_submissions.pt_shipment_id', $id);
            } else {
                $shipmentsResponsesRlt = $shipmentsResponsesRlt->where('form_submissions.id', $id);
            }

            $shipmentsResponsesRlt = $shipmentsResponsesRlt->get([
                "pt_submission_results.interpretation as result_interpretation",
                "pt_samples.name as sample_name"
            ]);


            $dataPayload = [];
            foreach ($hipmentsRefResult as $refRslt) {
                foreach ($shipmentsResponsesRlt as $rslt) {
                    if ($refRslt->sample_name == $rslt->sample_name) {
                        $data = [];
                        $data['result_interpretation'] = $rslt->result_interpretation;
                        $data['sample_name'] = $refRslt->sample_name;
                        $data['reference_result'] = $refRslt->reference_result;
                        $dataPayload[] = $data;
                    }
                }
            }

            return [
                'metadata' => $shipmentsResponses, "results" => $dataPayload
            ];
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch report data: ' . $ex->getMessage()], 500);
        }
    }


    public function getUserSampleResponseResult(Request $request)
    {
        return $this->geSamples($request->id);
    }
}
