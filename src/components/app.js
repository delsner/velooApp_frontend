(function () {
    'use strict';

    angular
        .module('velooAngular', ['velooApi', 'ngMaterial', 'ngSanitize', 'ngRoute', 'angular.filter', 'ngImgCrop', 'ngFileUpload', 'angular-scroll-animate', 'uiGmapgoogle-maps'])
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

        })
        .config(function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'visualization'
            });
        })
        .run(function ($location, $route, $rootScope, $mdSidenav, $mdMedia, $mdDialog, authService, $log) {
            $rootScope.$on('$routeChangeStart', function (evt, next, current) {
                var nextPath = $location.path(),
                    nextSearchParams = $location.search(),
                    nextRoute = next.$$route;
                if (nextRoute && nextRoute.auth && !authService.isAuthenticated()) {
                    $rootScope.routeVisited = nextPath;
                    $rootScope.routeVisitedSearchParams = nextSearchParams;
                    $location.path("/").search({});
                    $rootScope.showLogin();
                }
                /*if (authService.isAuthenticated()) {
                    authService.Person.getMessages().$promise.then(function (success) {
                        $rootScope.messagesSinceLastLogin = success;
                    });
                }*/
            });
        $rootScope.setPathTo = function (path) {
            //$mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right'); //TODO: notwendig?
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