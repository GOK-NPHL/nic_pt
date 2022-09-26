@extends('layouts.participant')

@section('content')
<div class="container-fluid">

    @if (Auth::user()->can('view_pt_component'))
    <div id="submission_form"></div>
    @endif

</div>
@endsection