@extends('layouts.participant')

@section('content')
<div class="container-fluid">

    @if (Auth::user()->can('view_pt_component'))
    <div id="readiness"></div>
    @endif

</div>
@endsection