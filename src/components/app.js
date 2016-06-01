(function () {
    'use strict';

    angular
        .module('velooAngular', ['ngMaterial', 'ngSanitize', 'ngRoute', 'angular.filter'])
        .config(function ($mdThemingProvider) {

            var velooMain = $mdThemingProvider.extendPalette('blue', {
                '500': '0B65C1' //main blue
            });

            var velooGreen = $mdThemingProvider.extendPalette('green', {
                '500': '46AD5A' //main green
            });

            $mdThemingProvider.definePalette('velooMain', velooMain);
            $mdThemingProvider.definePalette('velooGreen', velooGreen);

            $mdThemingProvider.theme('default')
                .primaryPalette('velooMain', {
                    'default': '500'
                })
                .accentPalette('velooGreen', {
                    'default': '500'
                })

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

        $rootScope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };

        /*$rootScope.showLogin = function () {
            $mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md'));

            $mdDialog.show({
                controller: 'authCtrl as ctrl',
                //templateUrl: 'components/auth/templates/login.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });

        };

        $rootScope.showSignup = function () {
            $mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md'));

            $mdDialog.show({
                controller: 'authCtrl as ctrl',
                //templateUrl: 'components/auth/templates/signup.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });

        };*/

    });
})();