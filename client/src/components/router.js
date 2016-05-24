(function (angular) {
    'use strict';

    angular
        .module('swfAngular')
        .config(router);

    function router($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                'templateUrl': 'components/home/home.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/transactionObject/create', {
                'templateUrl': 'components/transactionObject/transactionObjectCreate.tpl.html',
                'controller': 'transactionObjectCreateCtrl as ctrl',
                'auth': true
            })
            .when('/transactionObject/:id', {
                'templateUrl': 'components/transactionObject/transactionObject.tpl.html',
                'controller': 'transactionObjectCtrl as ctrl',
                'auth': false
            })
            .when('/transactionObject/:id/edit', {
                'templateUrl': 'components/transactionObject/transactionObjectEdit.tpl.html',
                'controller': 'transactionObjectEditCtrl as ctrl',
                'auth': true
            })
            .when('/bookingProcess/:id', {
                'templateUrl': 'components/bookingProcess/bookingProcess.tpl.html',
                'controller': 'bookingProcessCtrl as ctrl',
                'auth': true
            })
            .when('/signupConfirm/:code', {
                'templateUrl': 'components/auth/signupConfirm.tpl.html',
                'controller': 'authCtrl as ctrl',
                'auth': false
            })
            .when('/resetPassword/:code', {
                'templateUrl': 'components/auth/resetPassword.tpl.html',
                'controller': 'authCtrl as ctrl',
                'auth': false
            })
            .when('/account', {
                'templateUrl': 'components/account/account.tpl.html',
                'controller': 'accountCtrl as ctrl',
                'auth': true,
                'reloadOnSearch': false
            })
            .when('/search', {
                'templateUrl': 'components/search/search.tpl.html',
                'controller': 'swfSearchCtrl as ctrl',
                'auth': false
            })
            .when('/blog', {
                'templateUrl': 'components/blog/blog.tpl.html',
                'controller': 'blogCtrl as ctrl',
                'auth': false
            })
            .when('/communityLife', {
                'templateUrl': 'components/home/communityLife.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/trekking', {
                'templateUrl': 'components/home/trekking.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/natureProtection', {
                'templateUrl': 'components/home/natureProtection.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/localHistory', {
                'templateUrl': 'components/home/localHistory.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/codeOfConduct', {
                'templateUrl': 'components/home/codeOfConduct.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/safety', {
                'templateUrl': 'components/home/safety.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/impressum', {
                'templateUrl': 'components/home/impressum.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/help', {
                'templateUrl': 'components/home/help.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/contact', {
                'templateUrl': 'components/home/contact.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/dataPrivacy', {
                'templateUrl': 'components/home/dataPrivacy.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .otherwise({
                'redirectTo': '/'
            });
    }

})(angular);