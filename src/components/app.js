(function () {
    'use strict';

    angular
        .module('velooAngular', ['ngMaterial', 'ngSanitize', 'ngRoute', 'angular.filter'])
        .config(function ($mdThemingProvider) {


        }).run(function ($location, $rootScope, $mdSidenav) {
        $rootScope.setPathTo = function (path) {
            //$mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right');
            $location.search({}); //reset searchParams
            if (angular.isString(path)) {
                $location.path(path);
            } else {
                $log.error('path must be of type string. path =', path);
            }
        };
    });
})();