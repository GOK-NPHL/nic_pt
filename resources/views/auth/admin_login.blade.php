@extends('layouts.general_app')

@section('content')
<div style="background-color: #2c3e50 !important; width: 100%;" class="px-5">
    <nav style="background-color: #2c3e50 !important; border-color: #202d3b;" class="navbar navbar-light bg-light  justify-content-between">
        <a href="{{ route('index') }}" style="color: white;" class="navbar-brand">
            <h4>KNEQAS EQA</h4>
        </a>
        <form class="form-inline">

            <img style="max-height: 50px;" src="{{asset('images/kenya-logo.png')}}" />
        </form>
    </nav>
</div>

<div class="container-fluid">

    <div class="row justify-content-center">
        <div class="col-md-8">

            <div class="login-box home-purple" style="max-width: 430px; margin: auto; 
            padding:15px;
            margin-top: 10px; 
            color:white; text-align:center">
                <img style="max-height: 120px;" src="{{asset('images/nphl-logo-2.png')}}" />

                <div class="mt-2">
                    <h2 style="color: black;">KNEQAS PT System <p class="mt-4"> Administrative Login</p>
                    </h2>
                </div>

                <form style="text-align:justify" name="loginForm" id="login_form" method="POST" action="{{ route('admin-login') }}">

                    @csrf
                    @if($errors->any())
                    <span style="color:red">{{$errors->first()}}</span>
                    @endif
                    <input id="user_type" type="text" class="form-control" value="admin" name="user_type" hidden>
                    <div class="form-group">
                        <label style="color: black;" for="email" class="uname" data-icon="u"><strong> Email </strong></label>

                        <input id="email" name="email" class="isRequired form-control" title="Please enter your email address" type="text" placeholder="eg. mymail@mail.com" />
                        @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label style="color: black;" for="password" class="youpasswd" data-icon="p"> <strong> Password </strong> </label>

                        <input id="password" name="password" class="isRequired form-control" title="Please enter your password" type="password" placeholder="eg. X8df!90EO" />
                        @error('password')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                        <label style="color: black;" class="form-check-label" for="remember">
                            {{ __('Remember Me') }}
                        </label>
                    </div>

                    <div class="box-footer">
                        <input style="background-color: #2c3e50;" type="submit" class="btn col-md-12 btn-lg btn-info mt-3" value="Sign in" />
                    </div>

                    <div>

                        <!-- <a href="/auth/reset-password" style="font-size:0.8em;color:white;">Forgot Password?</a> -->
                        <!--<a href="/contact-us" style="">Don't have a login ? Click here to contact us</a>-->
                        @if (Route::has('password.request'))
                        <a class="btn btn-link" href="{{ route('password.request') }}">
                            {{ __('Forgot Your Password?') }}
                        </a>
                        @endif
                    </div>

                </form>
            </div>

        </div>
    </div>
</div>
@endsection