@extends('layouts.participant')

@section('content')
<div class="container-fluid">

    @if (Auth::user()->can('view_qc_component'))
    <div id="dashboard"></div>
    @endif

</div>
@endsection