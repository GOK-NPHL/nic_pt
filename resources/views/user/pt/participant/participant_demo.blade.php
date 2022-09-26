@extends('layouts.participant')

@section('content')
<div class="container-fluid">

    @if (Auth::user()->can('view_qc_component'))
    <div id="participant_demo"></div>
    @endif

</div>
@endsection