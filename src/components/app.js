(function () {
    'use strict';

    angular
        .module('velooAngular', ['velooApi', 'ngMaterial', 'ngSanitize', 'ngRoute', 'angular.filter'])
        .config(function ($mdThemingProvider) {


        }).run(function ($location, $rootScope, $mdSidenav, $mdMedia, $mdDialog) {
        $rootScope.setPathTo = function (path) {
            //$mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right'); //TODO: notwendig?
            $location.search({}); //reset searchParams
            if (angular.isString(path)) {
                $location.path(path);
            } else {
                $log.error('path must be of type string. path =', path);
            }
        };

        $rootScope.showLogin = function () {
            $mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right'); //TODO: notwendig?
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md')); //TODO: notwendig?

            $mdDialog.show({
                controller: 'authCtrl as ctrl',
                templateUrl: 'components/auth/templates/login.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        $rootScope.showSignup = function () {
            $mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right'); //TODO: notwendig?
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md')); //TODO: notwendig?

            $mdDialog.show({
                controller: 'authCtrl as ctrl',
                templateUrl: 'components/auth/templates/signup.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        $rootScope.logout = function logout() {
            authService.logout();
            $location.path('/');
            //$rootScope.routeVisited = null; //TODO: notwendig
            //window.location.reload(true); //TODO: notwendig
        };

    });
})();