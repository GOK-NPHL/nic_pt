<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<?php

use Illuminate\Support\Facades\Gate;
?>

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="MOH DLS NPHL - Laboratory EQA - HIV Recency Proficiency Testing.">
    <meta name="author" content="NPHL ICT" <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <link rel="shortcut icon" href="{{ asset('images/favicon/favicon.ico') }}">
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/adminlte.min.css') }}" rel="stylesheet">
    <!-- <link href="{{ asset('css/dataTables.bootstrap4.min.css') }}" rel="stylesheet"> -->
    <link href="{{ asset('css/jquery.dataTables.min.css') }}" rel="stylesheet">

    <!-- overlayScrollbars -->
    <link href="{{ asset('css/OverlayScrollbars.min.css') }}" rel="stylesheet">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">

</head>

<body>
    <style>
        .nav-link {
            color: white !important;
        }

        .nav-link:hover,
        .bg-light>a:hover {
            color: #74b8e9 !important;
            ;
        }

        .bg-light,
        .bg-light>a {
            color: white !important;
        }
    </style>
    <!-- Page Wrapper -->
    <div id="admin_page" class="wrapper">

        <!-- Navbar -->
        <div style="background-color: #2c3e50;" class="container-fluid">
            <div class="container">
                <nav style="background-color: #2c3e50 !important;" class="navbar navbar-expand-md navbar-light bg-light">
                    <a class="navbar-brand" href="{{route('admin-home')}}">KNEQAS PT</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto flex-fill">
                            <li class="nav-item active">
                                <a class="nav-link" href="{{route('admin-home')}}">Dashboard <span class="sr-only">(current)</span></a>
                            </li>

                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Managers &amp; Personnel
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{route('list-admin-user')}}">PT System Managers</a>
                                    <a class="dropdown-item" href="{{route('list-personel')}}">PT Lab Personel</a>
                                </div>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Laboratories
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown2">
                                    <a class="dropdown-item" href="{{route('list-lab')}}">PT Laboratories</a>
                                </div>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown3" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Checklists &amp; Shipments
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown3">
                                    <a class="dropdown-item" href="{{route('list-readiness')}}">Readiness Checklists</a>
                                    <a class="dropdown-item" href="{{route('pt-shipment')}}">PT Shipment</a>
                                </div>
                            </li>
                            {{--  <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Configure
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{route('list-admin-user')}}">PT System Managers</a>
                                    <a class="dropdown-item" href="{{route('list-lab')}}">PT Laboratories</a>
                                    <a class="dropdown-item" href="{{route('list-personel')}}">PT Lab Personel</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="{{route('list-readiness')}}">Readiness Checklists</a>
                                    <a class="dropdown-item" href="{{route('pt-shipment')}}">PT Shipment</a>
                                </div>
                            </li>  --}}

                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Reports &amp; Resources
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{route('pt-shipment-report-list')}}">PT Response Reports</a>
                                    <a class="dropdown-item" href="{{route('resourcesIndex')}}">Files / Resources</a>
                                </div>
                            </li>

                        </ul>

                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Account
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" style="text-transform:capitalize;" href="{{route('edit-admin-user',['userId'=>'bad6b8cf97131fceab'])}}">{{Auth()->user()->name ?? "Account"}}</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="{{route('admin-logout')}}">Logout</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <!-- /.navbar -->


        <!-- Content Wrapper. Contains page content -->
        <div style="background-color: white;" class="">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container">

                    <!-- Begin Page Content -->
                    <div class="container-fluid">
                        @yield('content')
                    </div>

                </div><!-- /.container-fluid -->
            </div>

            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->
        <style>
            .m-footer {
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;
                text-align: center;
            }
        </style>
        <footer class="m-footer pl-3 pr-3">
            <strong>Copyright &copy; 2014- <script>
                    document.write(new Date().getFullYear());
                </script> <a href="https://nphl.go.ke/">NPHL KNEQAS -QC/PT</a>.</strong>
            All rights reserved. | <a href="http://helpdesk.nphl.go.ke/">Recency QC/PT HELP DESK</a>
            <div class="float-right d-none d-sm-inline-block">
                <b>Version</b> 1.0.0
            </div>
        </footer>

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->

        <!-- Custom scripts for all pages-->
        <script src="{{ asset('js/adminlte.js') }}" defer></script>
    </div>
</body>

</html>