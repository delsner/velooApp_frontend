(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('authCtrl', authCtrl);

    function authCtrl($scope, $route, $location, $mdDialog, authService, $rootScope, $auth, $http) {
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
                $http.get('https://graph.facebook.com/me?access_token=' + res.access_token).then(function(res) {
                    console.log(res);
                    vm.fbname = res.data.name;
                    vm.fbtoken = res.data.id;
                    authService.fbaccountcheck(vm.fbtoken, vm.fbname).then(function (res) {
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
