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
    }

})();