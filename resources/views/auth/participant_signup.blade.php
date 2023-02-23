@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="login-box home-purple" style="max-width: 450px; margin: auto; 
            padding:15px;
            margin-top: 40px; 
            margin-bottom: 40px; 
            background-color: purple;
            color:white;">
                <div>

                    <h2 class="color:white;">Sign up - <span> NIC SARS-CoV2 PT</span></h2>
                </div>
                <form name="signupForm" id="signup_form" class="form-vertical" method="POST" action="{{ route('participant-signup') }}">
                    @csrf
                    @if($errors->any())
                    <hr />
                    <div class="alert alert-danger" style="white-space: pre-line; overflow: auto">{{$errors->first()}}</div>
                    </hr />
                    @endif
                    <input id="user_type" type="text" class="form-control" value="participant" name="user_type" hidden>
                    <div class="form-group">
                        <label for="fname" class="uname" data-icon="u"> First name </label>

                        <input id="fname" name="fname" class="isRequired form-control" title="Please enter your first name" type="text" placeholder="John" />
                        @error('fname')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="lname" class="uname" data-icon="u"> Last name </label>

                        <input id="lname" name="lname" class="isRequired form-control" title="Please enter your last name" type="text" placeholder="Ndiema" />
                        @error('lname')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="email" class="uname" data-icon="u"> Email address </label>

                        <input id="email" name="email" class="isRequired form-control" title="Please enter your email address" type="email" placeholder="mymail@mail.com" />
                        @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="phone" class="uname" data-icon="u"> Phone number </label>

                        <input id="phone" name="phone" class="isRequired form-control" title="Please enter your phone nymber" type="number" placeholder="0712345678" />
                        @error('phone')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $phone }}</strong>
                        </span>
                        @enderror
                    </div>
                    <!-- laboratory -->
                    <div class="form-group">
                        <label for="laboratory" class="uname" data-icon="u"> Laboratory </label>
                        <select id="laboratory" name="laboratory" class="form-control" title="Please select your laboratory">
                            <option value="">Select Laboratory</option>
                            @foreach($laboratories as $laboratory)
                            <option value="{{ $laboratory->id }}">{{ $laboratory->lab_name }}</option>
                            @endforeach
                        </select>
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
                    <div class="form-group">
                        <label for="password_repeat" class="youpasswd" data-icon="p"> Repeat password </label>

                        <input id="password_repeat" name="password_repeat" class="isRequired form-control" title="Please repeat your password" type="password" placeholder="eg. X8df!90EO" />
                        @error('password_repeat')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>

                    <div class="box-footer text-center">
                        <input type="submit" class="btn col-md-12 btn-lg btn-info" value="Sign up" />
                        <hr />
                        <p>Have an account? <a href="{{route('participant-login')}}">Log in</a></p>
                        <p><a href="/password/reset">Forgot Password?</a></p>
                    </div>

                    <div>
                        <hr />
                        <div class="form-check text-center">
                            <p>Your account will need to be approved before you can log in. Please contact the administrator to activate your account.</p>
                            <a style="display: inline-block;" class="btn btn-link" href="http://helpdesk.nphl.go.ke/index.php?a=add">
                                RTRI HELP DESK
                            </a>
                        </div>
                    </div>

                </form>
            </div>

        </div>
    </div>

    <style>
        #footer {
            /* position: absolute; */
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

</div>
@endsection