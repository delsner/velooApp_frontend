(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('authCtrl', authCtrl);

    function authCtrl($scope, $route, $location, $mdDialog, authService, $rootScope) {
        var vm = this;

        vm.cancel = $mdDialog.cancel;
        vm.login = login;
        vm.signup = signup;

        function login() {
            if (vm.username && vm.password) {
                authService.login(vm.username, vm.password).then(function (success) {
                    if ($rootScope.routeVisited) {
                        $location.path($rootScope.routeVisited).search($rootScope.routeVisitedSearchParams);
                        $rootScope.routeVisited = null;
                        $rootScope.routeVisitedSearchParams = null;
                        $rootScope.ownUsername = authService.getUserdata().username;
                    } else {
                        $route.reload();
                    }
                    $rootScope.getUserDetails();
                    vm.cancel();
                    console.log(success);
                }, function (error) {
                    console.log(error);
                    vm.submitError = true;
                });
            } else {
                vm.formInvalid = true;
            }
        }

        function signup() {
            if (vm.username && vm.password) {
                authService.signup(vm.username, vm.password).then(function (success) {
                    vm.cancel();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Welcome!')
                            .textContent('Welcome at Veloo!')
                            .ok('OK'));
                }, function (error) {
                    console.log(error);
                    vm.submitError = true;
                });
            } else {
                vm.formInvalid = true;
            }
        }
    }
})();
