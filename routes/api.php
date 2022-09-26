<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\FormSubmissionController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PT\PTReadinessController;
use App\Http\Controllers\PT\PTShipmentController;
use App\Http\Controllers\QC\QCAdminUsersController;
use App\Http\Controllers\Service\CommonsController;
use App\Http\Controllers\Service\ReadinessController;
use App\Http\Controllers\Service\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/save_submission', [Submission::class, 'createSubmission']);
Route::get('/get_submissions', [Submission::class, 'getSubmissions']);
Route::get('/get_submission_by_id/{id}', [Submission::class, 'getSubmissionById']);
Route::post('/update_submission', [Submission::class, 'updateSubmission']);

Route::get('all-submissions', [FormSubmissionController::class, 'getSubmissions'])->name('get-participant-submission')->middleware('auth:admin');
Route::get('submission/{id}', [FormSubmissionController::class, 'getSubmission'])->name('get-participant-submission')->middleware('auth');
Route::get('submission/shipment/{id}', [FormSubmissionController::class, 'getUserSubmissionsByShipment'])->name('get-participant-submission')->middleware('auth');
Route::post('submissions/{shipmentId}/new', [FormSubmissionController::class, 'storeSubmission'])->name('new-participant-submission')->middleware('auth');
Route::put('submissions/{shipmentId}/edit/{submissionId}', [FormSubmissionController::class, 'updateSubmission'])->name('update-participant-submission')->middleware('auth');

Route::get('/get_admin_users', [QCAdminUsersController::class, 'getAdminUsers']);
Route::get('/get_admin_user/{id}', [AdminAuthController::class, 'getAdminUser']);
Route::post('create_admin', [AdminAuthController::class, 'create']);
Route::post('edit_admin', [AdminAuthController::class, 'edit']);

Route::get('/get_participants', [ParticipantController::class, 'getParticipants'])->name('get_participants')->middleware('auth:admin');
Route::get('/get_participant/{id}', [ParticipantController::class, 'getParticipant'])->name('get_participant')->middleware('auth:admin');
Route::post('/create_participant', [ParticipantController::class, 'createParticipant'])->name('create_participant')->middleware('auth:admin');
Route::post('edit_participant', [ParticipantController::class, 'editParticipant'])->name('edit_participant')->middleware('auth:admin');

Route::get('/get_lab_personel', [ParticipantController::class, 'getLabPersonel'])->name('get_lab_personel')->middleware('auth:admin');
Route::get('/get_lab_personel/{id}', [ParticipantController::class, 'getLabPersonelById'])->middleware('auth:admin');
Route::post('/create_lab_personel', [ParticipantController::class, 'createLabPersonel'])->name('create_lab_personel')->middleware('auth:admin');
Route::post('/edit_lab_personel', [ParticipantController::class, 'editPersonel'])->name('edit_lab_personel')->middleware('auth:admin');

Route::get('/get_readiness', [PTReadinessController::class, 'getReadiness'])->name('get_readiness')->middleware('auth:admin');
Route::get('/get_shipment_readiness', [PTReadinessController::class, 'getShipmentReadiness'])->name('get_shipment_readiness')->middleware('auth:admin');
Route::post('/approve_readiness_answer', [PTReadinessController::class, 'approveReadinessAnswer'])->middleware('auth:admin');

Route::post('/create_readiness', [PTReadinessController::class, 'saveReadiness'])->name('create_readiness')->middleware('auth:admin');
Route::get('/get_readiness_by_id/{id}', [PTReadinessController::class, 'getReadinessById'])->middleware('auth:admin');
Route::post('/edit_readiness', [PTReadinessController::class, 'editReadiness'])->name('edit_readiness')->middleware('auth:admin');

// Route::get('/get_shipments', [PTShipmentController::class, 'getShipments'])->name('get_shipment')->middleware('auth:admin');
Route::get('/get_shipments/{userId}/{filterEmpty}', [PTShipmentController::class, 'getShipments'])->name('get_shipment');
Route::post('/create_shipment', [PTShipmentController::class, 'saveShipment'])->name('create_shipment')->middleware('auth:admin');
Route::post('/update_shipment', [PTShipmentController::class, 'updateShipment'])->name('update_shipment')->middleware('auth:admin');
Route::get('/get_shipment_by_id/{id}', [PTShipmentController::class, 'getShipmentById'])->middleware('auth:admin');

Route::get('/get_user_samples', [PTShipmentController::class, 'getUserSamples'])->middleware('auth');
Route::get('/get_counties', [CommonsController::class, 'getCounties']);

Route::get('/get_participant_demographics', [ParticipantController::class, 'getParticipantDemographics']);
Route::get('/get_participant_demographics/{id}', [ParticipantController::class, 'getParticipantDemographics']);
Route::post('/own_bio_update', [ParticipantController::class, 'editOwnPersonalBio'])->name('own_bio_update')->middleware('auth');

Route::get('/get_readiness_survey', [ReadinessController::class, 'getReadinessSurvey'])->middleware('auth');
Route::get('/get_readiness_survey_by_id/{id}', [ReadinessController::class, 'getReadinessSurveyById'])->middleware('auth');
Route::get('/get_readiness_survey_by_id_and_labid/{id}/{labId}', [ReadinessController::class, 'getReadinessSurveyById'])->middleware('auth:admin');

Route::get('/get_readiness_response/{id}', [ReadinessController::class, 'getReadinessResponse'])->middleware('auth:admin');

Route::post('/save_survey_answers', [ReadinessController::class, 'saveSurveyAnswers']);

/////
Route::get('/get_shipment_responses/{id}', [PTShipmentController::class, 'getShipmentResponsesById'])->middleware('auth:admin');

Route::get('/get_sample_response_result/{id}', [PTShipmentController::class, 'getUserSampleResponseResult'])->middleware('auth:admin');

Route::get('/get_shipment_response_report/{id}/{is_part}', [PTShipmentController::class, 'getShipmentResponseReport']);

Route::get('/get_user_id', [CommonsController::class, 'getUserId']);
Route::get('/get_user_params', [CommonsController::class, 'getUserParticulars']);
Route::get('/get_admin_params', [AdminAuthController::class, 'getAdminParticulars']);

Route::get('resources/files_all',['as'=>'resources.files', 'uses'=>'ResourceFilesController@getAllFiles']);
Route::get('resources/files_public',['as'=>'resources.files_public', 'uses'=>'ResourceFilesController@getPublicFiles']);
Route::get('resources/files_private',['as'=>'resources.files_private', 'uses'=>'ResourceFilesController@getPrivateFiles']);
Route::delete('resources/files/{id}',['as'=>'resources.delete', 'uses'=>'ResourceFilesController@destroy']);
Route::get('resources/files/download/{id}',['as'=>'resources.download', 'uses'=>'ResourceFilesController@download']);
Route::post('resources/files',['as'=>'resources.store', 'uses'=>'ResourceFilesController@store']);