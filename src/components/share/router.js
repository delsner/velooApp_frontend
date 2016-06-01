(function (angular) {
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
                'templateUrl': 'components/bicycle/templates/createBicycle.tpl.html',
                'controller': 'bicycleCtrl as ctrl',
                'auth': false
            })
            .when('/bicycle/edit', {
                'templateUrl': 'components/bicycle/templates/editBicycle.tpl.html',
                'controller': 'bicycleCtrl as ctrl',
                'auth': false
            })
            .when('/bicycle/:id', {
                'templateUrl': 'components/bicycle/templates/bicycle.tpl.html',
                'controller': 'bicycleCtrl as ctrl',
                'auth': false
            })
    }

})(angular);