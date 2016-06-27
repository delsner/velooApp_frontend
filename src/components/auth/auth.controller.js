(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('authCtrl', authCtrl);

    function authCtrl($scope, $route, $location, $mdDialog, authService, $rootScope, $auth) {
        var vm = this;

        vm.cancel = $mdDialog.cancel;
        vm.login = login;
        vm.signup = signup;
        vm.sendPasswordToMail = sendPasswordToMail;
        vm.showForgotPassword = showForgotPassword;
        vm.authenticate = authenticate;

        function sendPasswordToMail() {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Thank you!')
                .textContent('A password reset Email was sent to you!')
                .ok('OK'));
                //TODO 
            vm.cancel();
        }

        function authenticate(provider) {
            $auth.authenticate(provider).then(function (res) {
                console.log(res.access_token);
                vm.fbtoken = res.access_token;
                $rootScope = res.access_token;
                $scope = res.access_token;
                authService.fbaccountcheck(res.access_token).then(function (res) {
                        if(res.status == 204) {
                            $mdDialog.show({
                                controller: 'fbloginCtrl as ctrl',
                                templateUrl: 'components/auth/templates/fblogin.tpl.html',
                                parent: angular.element(document.body),
                                clickOutsideToClose: true,
                            });
                        } else {
                            vm.cancel();
                        }
                    });
            }, function (err) {
                console.log(err);
            });
        }

        function login() {
            if (vm.username && vm.password) {
                authService.login(vm.username, vm.password).then(function (success) {
                    if ($rootScope.routeVisited) {
                        $location.path($rootScope.routeVisited).search($rootScope.routeVisitedSearchParams);
                        $rootScope.routeVisited = null;
                        $rootScope.routeVisitedSearchParams = null;
                    } else {
                        $route.reload();
                    }
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

        function showForgotPassword() {
            $mdDialog.show({
                controller: 'authCtrl as ctrl',
                templateUrl: 'components/auth/templates/passwordforgot.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
            });
        }

    }
})();
