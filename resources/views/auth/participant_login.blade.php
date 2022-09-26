@extends('layouts.app')

@section('content')
<div class="container-fluid">

    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="login-box home-purple" style="max-width: 430px; margin: auto; 
            padding:15px;
            margin-top: 100px; 
            background-color: purple;
            color:white;">
                <div>

                    <h2 class="color:white;">Login - <span> RTRI Quality Control</span></h2>
                </div>
                <form name="loginForm" id="login_form" class="form-vertical" method="POST" action="{{ route('participant-login') }}">
                    @csrf
                    @if($errors->any())
                    <span style="color:red">{{$errors->first()}}</span>
                    @endif
                    <input id="user_type" type="text" class="form-control" value="participant" name="user_type" hidden>
                    <div class="form-group">
                        <label for="email" class="uname" data-icon="u"> Email address </label>

                        <input id="email" name="email" class="isRequired form-control" title="Please enter your email address" type="text" placeholder="mymail@mail.com" />
                        @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="password" class="youpasswd" data-icon="p"> Password </label>

                        <input id="password" name="password" class="isRequired form-control" title="Please enter your password" type="password" placeholder="eg. X8df!90EO" />
                        @error('password')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>

                    <div class="box-footer">
                        <input type="submit" class="btn col-md-12 btn-lg btn-info" value="Sign in" />
                    </div>

                    <div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                            <label class="form-check-label" for="remember">
                                {{ __('Remember Me') }}
                            </label>
                        </div>
                        <!-- <a href="/auth/reset-password" style="font-size:0.8em;color:white;">Forgot Password?</a> -->
                        <!--<a href="/contact-us" style="">Don't have a login ? Click here to contact us</a>-->
                        @if (Route::has('password.request'))
                        <a style="display: inline-block;" class="btn btn-link" href="{{ route('password.request') }}">
                            {{ __('Forgot Your Password?') }}
                        </a>
                        @endif
                        | <a style="display: inline-block;" class="btn btn-link" href="http://helpdesk.nphl.go.ke/index.php?a=add">
                            RTRI HELP DESK
                        </a>
                    </div>

                </form>
            </div>

        </div>
    </div>

    <style>
        #footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 60px;
            /* Height of the footer */
            /* background: #6cf; */
        }

        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            /* background-color: #333333; */
        }

        li {
            float: left;
        }

        li a {
            display: block;
            color: white;
            text-align: center;
            padding: 16px;
            text-decoration: none;
        }

        li a:hover {
            background-color: #111111;
            color: white;
        }
    </style>
    <footer class="text-center" id="footer">

        <div class="row d-flex justify-content-center">
            <!--Grid column-->
            <div class="col-sm-12">

                <ul class="d-flex justify-content-center">
                    <li><a href="#home">Home |</a></li>
                    <li><a href="#news">About Us |</a></li>
                    <li><a href="#contact">Resources |</a></li>
                    <li><a href="#about">FAQ |</a></li>
                    <li><a href="{{ route('admin-login') }}">Admin Login |</a></li>
                    <li><a href="#about">NPHL Help Desk |</a></li>
                    <li><a href="#about">2020 © National Public Health Laboratory</a></li>
                </ul>
            </div>
            <!--Grid column-->
        </div>

    </footer>

</div>
@endsection