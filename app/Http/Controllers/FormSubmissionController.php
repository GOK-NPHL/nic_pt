<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FormSubmissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
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
}
