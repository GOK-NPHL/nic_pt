<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Readiness;
use App\ReadinessAnswer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReadinessController extends Controller
{

    public function getReadinessSurvey(Request $request)
    {
        $user = Auth::user();
        try {

            // $readinesses = Readiness::select(

            $readinesses =   DB::table("readinesses")->distinct()
                ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
                ->leftJoin('pt_shipements', 'readinesses.id', '=', 'pt_shipements.readiness_id')
                ->leftJoin('readiness_answers', 'readinesses.id', '=', 'readiness_answers.readiness_id')
                // ->join('readiness_questions', 'readiness_questions.readiness_id', '=', 'readinesses.id')
                ->where('users.id', $user->id)
                ->orderBy('readinesses.created_at', 'Desc')
                ->get([
                    "readinesses.id",
                    "readinesses.start_date",
                    "readinesses.end_date",
                    "readinesses.name",
                    "pt_shipements.round_name",
                    "readinesses.admin_id",
                    "readiness_answers.readiness_id as aswered_id",
                    "readinesses.created_at"
                ]);

            return $readinesses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function getReadinessSurveyById(Request $request)
    {
        $user = Auth::user();

        $parameter = 'users.id';
        $condition = $user->id;

        try {
            try {
                if ($request->labId) {
                    $parameter = 'laboratories.id';
                    $condition = $request->labId;
                }
            } catch (Exception $ex) {
            }

            $readinesses = DB::table("readinesses")->distinct()->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                ->join('readiness_questions', 'readiness_questions.readiness_id', '=', 'readinesses.id')
                ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
                ->where('readinesses.id', $request->id)
                ->where($parameter, $condition)

                ->get([
                    "readinesses.id",
                    "readinesses.start_date",
                    "readinesses.end_date",
                    "readinesses.name",
                    "readinesses.admin_id",
                    "laboratories.id as lab_id",
                    "readiness_questions.id as question_id",
                    "readiness_questions.question",
                    "readiness_questions.answer_options",
                    "readiness_questions.answer_type",
                    "readiness_questions.qustion_position",
                    "readiness_questions.qustion_type",
                    "readiness_questions.is_required"
                ]);

            $readinessesAswers = DB::table("readiness_answers")
                ->distinct()->join('laboratories', 'readiness_answers.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
                ->where('readiness_answers.readiness_id', $request->id)
                ->where($parameter, $condition)
                ->get([
                    "readiness_answers.id",
                    "readiness_answers.question_id",
                    "readiness_answers.answer"
                ]);

            return ['questions' => $readinesses, 'answers' => $readinessesAswers];
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function saveSurveyAnswers(Request $request)
    {
        try {
            //$request->survey['questionsAnswerMap']
            $user = Auth::user();

            foreach ($request->survey['questionsAnswerMap']  as $key => $value) {

                $readinessAswers = ReadinessAnswer::updateOrCreate(

                    [
                        'question_id' => $key,
                        'laboratory_id' => $request->survey['lab_id'],
                        'readiness_id' =>  $request->survey['readiness_id']

                    ],
                    [
                        'question_id' => $key,
                        'answer' => $value,
                        'lab_id' => $request->survey['lab_id'],
                        'user_id' => $user->id,
                        'readiness_id' =>  $request->survey['readiness_id']
                    ]

                );
            }

            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    public function getReadinessResponse(Request $request)
    {
        $user = Auth::user();
        try {
            /*
                select * from laboratory_readiness lab_rd
                                    join laboratories laboratories on laboratories.id = lab_rd.laboratory_id
                                    join readinesses readinesses on lab_rd.readiness_id = readinesses.id
                #                     left outer join readiness_answers readiness_answers on laboratories.id = readiness_answers.laboratory_id and lab_rd.readiness_id = readiness_answers.readiness_id
                                    left join users users on users.id = (select distinct readiness_answers.user_id from readiness_answers where readiness_answers.readiness_id = lab_rd.readiness_id)
                                    left join readiness_approvals readiness_approvals on lab_rd.readiness_id = readiness_approvals.readiness_id and readiness_approvals.lab_id = lab_rd.laboratory_id
                                where lab_rd.readiness_id = 3;
            */
            $readinesses = DB::table("laboratory_readiness") //->distinct()
                ->join('laboratories', 'laboratories.id', '=', 'laboratory_readiness.laboratory_id')
                ->join('readinesses', 'readinesses.id', '=', 'laboratory_readiness.readiness_id')
                ->leftJoin('readiness_answers', function ($join) use ($request) {
                    $join->on('readiness_answers.readiness_id', '=', 'readinesses.id')
                        ->on('readiness_answers.laboratory_id', '=', 'laboratories.id');
                })
                ->leftJoin('users', 'users.id', '=', 'readiness_answers.user_id')->distinct('users.id')
                ->leftJoin('readiness_approvals', function($join) {
                    $join->on('readiness_approvals.readiness_id', '=', 'laboratory_readiness.readiness_id');
                    $join->on('readiness_approvals.lab_id', '=', 'laboratory_readiness.laboratory_id');
                })
                ->where('laboratory_readiness.readiness_id', $request->id)
                ->get([
                    "readinesses.id",
                    "readinesses.start_date",
                    "readinesses.end_date",
                    "readinesses.name",
                    "laboratories.id as lab_id",
                    "users.name as fname",
                    "users.second_name as sname",
                    "users.email as email",
                    "laboratories.phone_number",
                    "laboratories.lab_name",
                    "laboratories.email",
                    "readiness_answers.id as readiness_id as answer_id",
                    "readiness_answers.created_at",
                    "readiness_answers.updated_at",
                    "readiness_approvals.id as approved_id"
                ]);
                // filter out the duplicate records by user_id and lab_id
                $readinesses = $readinesses->unique('email', 'readinesses.id');

            return $readinesses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }
}
