(function () {
    'use strict';

    angular
        .module('swfAngular', ['ngMaterial', 'ngSanitize', 'ngRoute', 'angular.filter', 'swfApi', 'swfAuth', 'ui-leaflet', 'swfSearch', 'ngFileUpload', 'ngImgCrop', 'luegg.directives'])
        .config(function ($mdThemingProvider) {

            var swfMain = $mdThemingProvider.extendPalette('green', {
                '500': '395626',
                '50': 'afcf7f',
                '100': '403616', //brown
                '200': 'bed7ed' //blue
            });

            var swfRed = $mdThemingProvider.extendPalette('red', {
                '500': 'ac0c1d'
            });

            var swfYellow = $mdThemingProvider.extendPalette('yellow', {
                '500': 'fee433'
            });

            $mdThemingProvider.definePalette('swfMain', swfMain);
            $mdThemingProvider.definePalette('swfRed', swfRed);
            $mdThemingProvider.definePalette('swfYellow', swfYellow);

            $mdThemingProvider.theme('default')
                .primaryPalette('swfMain', {
                    'default': '500', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '50',
                    'hue-2': '100',
                    'hue-3': '200'
                })
                .accentPalette('swfYellow', {
                    'default': '500'
                })
                .warnPalette('swfRed', {
                    'default': '500'
                });

        }).run(function ($location, $rootScope, $route, swfAuth, swfData, $mdDialog, $mdMedia, $mdSidenav, swfAccountService) {
        $rootScope.$on('$routeChangeStart', function (evt, next, current) {
            var nextPath = $location.path(),
                nextSearchParams = $location.search(),
                nextRoute = next.$$route;
            if (nextRoute && nextRoute.auth && !swfAuth.isAuthenticated()) {
                $rootScope.routeVisited = nextPath;
                $rootScope.routeVisitedSearchParams = nextSearchParams;
                $location.path("/").search({});
                $rootScope.showLogin();
            }
            if (swfAuth.isAuthenticated()) {
                swfData.Person.getMessages().$promise.then(function (success) {
                    $rootScope.messagesSinceLastLogin = success;
                });
            }
        });

        $rootScope.showLogin = function () {
            $mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md'));

            $mdDialog.show({
                controller: 'authCtrl as ctrl',
                templateUrl: 'components/auth/login.tpl.html',
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
                templateUrl: 'components/auth/signup.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });

        };

        $rootScope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };

        $rootScope.updateAvatar = function () {
            swfAccountService.getAvatar($rootScope.ownUsername).then(function (result) {
                $rootScope.myAvatar = result;
            });
        };

        $rootScope.logout = function logout() {
            swfAuth.logout();
            $location.path('/');
            //$rootScope.routeVisited = null;
            window.location.reload(true);
        }

    });
})();