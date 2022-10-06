<!doctype html>
<html style="height: 100%;" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <link rel="shortcut icon" href="{{ asset('images/favicon/favicon.ico') }}">
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body style="background-image: url('{{asset('images/pt.png')}}');
            background-repeat: no-repeat;
            background-size: cover; height: 100%; overflow: hidden; overflow-y: scroll;">
    <div>

        <main class="py-4">



            <div class="container">
                <nav class="navbar navbar-expand-lg navbar static-top">
                    <div class="container">
                        <!-- <a class="navbar-brand" href="#">
                            <img src="http://placehold.it/150x50?text=Logo" alt="">
                        </a> -->


                        <a style="color: #FFF;" class="navbar-brand" href="/" title="{{ config('app.name', 'SARS-CoV2 PT') }}">

                            <div>
                                <div class="float-left">
                                    <img src="{{ asset('images/moh-logo.png') }}" height="60" width="60" />
                                </div>
                                <div class="float-right" style="font-size:0.8em;margin-left: 10px;">
                                    Ministry of health<br>
                                    National Public Health Laboratories<br>
                                    NIC - SARS-CoV2 PT
                                </div>
                            </div>
                        </a>



                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarResponsive">
                            <ul class="navbar-nav ml-auto">
                                <li style="background-color: purple;" class="nav-item active">
                                    <a style="color: white;" class="nav-link" href="http://ept.nphl.go.ke">About Us
                                        <span class="sr-only">(current)</span>
                                    </a>
                                </li>
                                <!-- <li style="background-color: purple; color: white;" class="nav-item">
                                    <a style="color: white;" class="nav-link" href="#">Library</a>
                                </li> -->
                                <li style="background-color: purple;" class="nav-item">
                                    <a style="color: white;" class="nav-link" href="http://ept.nphl.go.ke">Contact Us</a>
                                </li>
                                <li style="background-color: purple;" class="nav-item">
                                    <a style="color: white;" class="nav-link" href="/participant-signup">SIGN UP</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>


                <div style="background-color: purple; color:white">
                    <center class="home-app-info">
                        <div class="clearfix">&nbsp;</div>

                        <h1>KENYA EXTERNAL QUALITY ASSESSMENT SCHEME (KNEQAS)</h1>
                        <p>Monitoring and improving the quality of HIV results generated from your laboratory</p>
                        <h3>NIC COVID PT</h3>


                        <p>For any queries on the use of the system, please create a ticket on the
                            <a href='http://helpdesk.nphl.go.ke/index.php?a=add'>NPHL Help Desk</a> and we shall get back to you.
                        </p>

                        <div class="clearfix">&nbsp;</div>

                    </center>
                </div>

                <div style="margin-top: 30px;" class="text-center">
                    <div class="clearfix">&nbsp;</div>
                    <div>
                        <a style="background-color: purple; color:white" href="{{ route('participant-login') }}" class="btn home-purple btn-lg ">Click to login</a>
                    </div>
                    </p>
                </div>



            </div>
        </main>




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
</body>

</html>