(function () {
    'use strict';

    angular
        .module('velooAngular')
        .config(router);

    function router($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                'templateUrl': 'components/home/templates/home.tpl.html',
                'controller': 'homeCtrl as ctrl',
                'auth': false
            })
            .when('/bicycle/create', {
                'templateUrl': 'components/bicycle/create/createBicycle.tpl.html',
                'controller': 'createBicycleCtrl as ctrl',
                'auth': false
            })
            .when('/bicycle/edit', {
                'templateUrl': 'components/bicycle/edit/editBicycle.tpl.html',
                'controller': 'bicycleCtrl as ctrl',
                'auth': false
            })
            .when('/bicycle/', {
                'templateUrl': 'components/bicycle/show/bicycle.tpl.html',
                'controller': 'bicycleCtrl as ctrl',
                'auth': false
            })
    }

})();