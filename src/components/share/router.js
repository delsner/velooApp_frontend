(function () {
    'use strict';

    angular
        .module('velooAngular')
        .config(router);

    function router($routeProvider) {
        $routeProvider
            .when('/', {
                'templateUrl': 'components/home/templates/home.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/bicycle/create', {
                'templateUrl': 'components/bicycle/create/createBicycle.tpl.html',
                'controller': 'createBicycleCtrl as ctrl',
                'auth': true
            })
            .when('/bicycle/edit/:id', {
                'templateUrl': 'components/bicycle/edit/editBicycle.tpl.html',
                'controller': 'bicycleCtrl as ctrl',
                'auth': true
            })
            .when('/bicycle/:id', {
                'templateUrl': 'components/bicycle/show//templates/showBicycle.tpl.html',
                'controller': 'showBicycleCtrl as ctrl',
                'auth': false
            })
            .when('/search', {
                'templateUrl': 'components/search/search.tpl.html',
                'controller': 'searchCtrl as ctrl',
                'auth': false
            })
            .when('/account', {
                'templateUrl': 'components/account/templates/account.tpl.html',
                'controller': 'accountCtrl as ctrl',
                'auth': true
            })
            .when('/booking/:id', {
                'templateUrl': 'components/booking/templates/booking.tpl.html',
                'controller': 'bookingCtrl as ctrl',
                'auth': true
            })
    }

})();