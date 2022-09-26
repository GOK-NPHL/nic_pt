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
    <link href="{{ asset('css/original.adminlte.css') }}" rel="stylesheet">
    <link href="{{ asset('css/adminlte.min.css') }}" rel="stylesheet">
    <!-- <link href="{{ asset('css/dataTables.bootstrap4.min.css') }}" rel="stylesheet"> -->
    <link href="{{ asset('css/jquery.dataTables.min.css') }}" rel="stylesheet">

    <!-- overlayScrollbars -->
    <link href="{{ asset('css/OverlayScrollbars.min.css') }}" rel="stylesheet">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">

</head>

<body class="hold-transition sidebar-mini layout-fixed">
    <!-- Page Wrapper -->
    <div id="app" class="wrapper">

        <!-- Navbar -->
        <nav style="background-color: #3c8dbc;" class="main-header navbar navbar-expand navbar-white navbar-light">
            <!-- Left navbar links -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" style="color: white;" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>
        </nav>
        <!-- /.navbar -->

        <!-- Main Sidebar Container -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <!-- Brand Logo -->
            <a href="index3.html" style="padding: 2.4px; background-color: #3c8dbc;" class="brand-link">
                <img style="max-width: 20%" src="{{URL('/images/coat.png')}}" alt="">
                <span class="brand-text" style="font-weight: 300; 
                                                font-size: 20px;
                                                line-height: 50px;
                                                text-align: center;
                                                font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
                                                font-weight: 300">
                    RTRI PT
                </span>
            </a>

            <!-- Sidebar -->
            <div class="sidebar">
                <!-- Sidebar user panel (optional) -->

                <!-- Sidebar Menu -->
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->

                        <?php
                        if (Gate::allows('view_pt_component')) { ?>
                            <li class="nav-item has-treeview menu-open">
                                <a href="{{ route('participant-pt-home') }}" class="nav-link">
                                    <i class="nav-icon fas fa-book"></i>
                                    <p>
                                        RTRI PT
                                    </p>
                                </a>
                            </li>
                        <?php } ?>

                        <!-- system actions -->
                        <li class="nav-item has-treeview">
                            <a href="#" class="nav-link">
                                <i class="nav-icon fas fa-copy"></i>
                                <p>
                                    Reports
                                    <i class="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="#" class="nav-link">
                                        <i class="far fa-circle nav-icon"></i>
                                        <p>Individual reports</p>
                                    </a>
                                </li>
                                <!-- <li class="nav-item">
                                    <a href="pages/layout/top-nav-sidebar.html" class="nav-link">
                                        <i class="far fa-circle nav-icon"></i>
                                        <p>Summary</p>
                                    </a>
                                </li> -->
                            </ul>
                        </li>
                        <!-- end system actions -->


                        <!-- Account features-->
                        <li class="nav-item has-treeview">
                            <a href="#" class="nav-link">
                                <i class="fas fa-user"></i>
                                <p>
                                    My Account
                                    <i class="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="{{ route('participant-pt-demographics') }}" class="nav-link">
                                        <i class="far fa-circle nav-icon"></i>
                                        <p>My Login Information</p>
                                    </a>
                                </li>
                                <!-- <li class="nav-item">
                                    <a href="pages/layout/top-nav-sidebar.html" class="nav-link">
                                        <i class="far fa-circle nav-icon"></i>
                                        <p>Change password</p>
                                    </a>
                                </li> -->
                            </ul>
                        </li>
                        <!-- end account features -->

                        <li class="nav-item">
                            <a href="{{route('logout')}}" class="nav-link">
                                <i class="fas fa-sign-out-alt"></i>
                                <p>
                                    Logout

                                </p>
                            </a>
                        </li>

                        <!-- <li class="nav-header">EXAMPLES</li>
                        <li class="nav-item">
                            <a href="pages/calendar.html" class="nav-link">
                                <i class="nav-icon far fa-calendar-alt"></i>
                                <p>
                                    Calendar
                                    <span class="badge badge-info right">2</span>
                                </p>
                            </a>
                        </li> -->
                    </ul>
                </nav>
                <!-- /.sidebar-menu -->
            </div>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->
        <div style="background-color: white;" class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container-fluid">

                    <!-- Begin Page Content -->
                    <div class="container-fluid">
                        @yield('content')
                    </div>

                </div><!-- /.container-fluid -->
            </div>
            <!-- /.content-header -->

            <!-- Main content -->

            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->
        <footer class="main-footer">
            <strong>Copyright &copy; 2014- <script>
                    document.write(new Date().getFullYear());
                </script> <a href="https://nphl.go.ke/">NPHL KNEQAS - RTRI PT</a>.</strong>
            All rights reserved. | <a href="http://helpdesk.nphl.go.ke/">RTRI PT HELP DESK</a>
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