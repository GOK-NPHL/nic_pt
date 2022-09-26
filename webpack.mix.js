const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/js/app.js', 'public/js')
    .react('resources/js/adminlte.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .postCss('resources/css/adminlte.min.css', 'public/css')
    .postCss('./node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css', 'public/css')
    .postCss('./node_modules/datatables.net-dt/css/jquery.dataTables.min.css', 'public/css')
    .postCss('resources/css/OverlayScrollbars.min.css', 'public/css');

    