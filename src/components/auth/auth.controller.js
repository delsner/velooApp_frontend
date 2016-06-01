(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('authCtrl', authCtrl);

    function authCtrl($scope, $mdDialog, authService, $rootScope) {
        var vm = this;

        vm.cancel = $mdDialog.cancel;
        vm.login = login;
        vm.signup = signup;

        function login() {
            if (vm.username && vm.password) {
                authService.login(vm.username, vm.password).then(function (success) {
                    vm.cancel();
                    console.log(success);
                }, function (error) {
                    console.log(error);
                });
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
                            .title('Herzlich Willkommen!')
                            .textContent('Wir haben Sie erfolgreich für Sharewood-Forest registriert und Ihnen eine Email geschickt. Bitte folgen Sie den weiteren Anweisungen in der Email.')
                            .ok('OK'));
                }, function (error) {
                    console.log(error);
                });
            }
        }
    }
})();
