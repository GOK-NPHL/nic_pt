/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./user/pt/admin/Dashboard');
require('./user/pt/admin/AddLab');
require('./user/pt/admin/EditLab');
require('./user/pt/admin/AddPersonel');
require('./user/pt/admin/EditPersonel');
require('./user/pt/admin/AddUser');
require('./user/pt/admin/EditUser');
require('./user/pt/admin/ListLab');
require('./user/pt/admin/ListPersonel');
require('./user/pt/admin/ListUser');

require('./user/pt/admin/ListFiles');

require('./user/pt/shipment/PtShipment');
require('./user/pt/shipment/ListShipmentResponse');
require('./user/pt/shipment/ShipmentResponseForm');
require('./user/pt/readiness/AddReadiness');
require('./user/pt/readiness/EditReadiness');
require('./user/pt/readiness/ListReadiness');
require('./user/pt/readiness/ReadinessResponse');
require('./user/pt/participant/Dashboard');
require('./user/pt/participant/Readiness');
require('./user/pt/participant/Demographics');
///////
require('./user/pt/participant/SubmissionForm');
///////

require('./user/pt/reports/ListShipmentReport');
require('./user/pt/reports/ListShipmentResponseReport');
require('./user/pt/reports/PTPerformanceReport');
require('./user/pt/shipment/SubmissionView');


require('./user/general/Dashboard');
//Intrface code
require('./components/system/auth/axios_login');
require('xlsx');
require("uuid/v4");
require("react-datepicker");
require("react-js-pagination");
require('bootstrap-select');
require('react-tooltip');
require('../../node_modules/@fortawesome/fontawesome-free/js/fontawesome.js');

require('../../node_modules/jquery.easing/jquery.easing.min.js');
