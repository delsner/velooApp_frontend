(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .config(router);

    function router($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                'templateUrl': '',
                'controller': '',
                'auth': false
            })
    }

})(angular);