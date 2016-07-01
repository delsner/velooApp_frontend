/**
 * Created by lukasmohs on 27/06/16.
 */
(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('fbloginCtrl', fbloginCtrl);

    function fbloginCtrl($scope, $route, $mdDialog, authService, $rootScope, $auth) {
        var vm = this;
        vm.cancel = $mdDialog.cancel;
        vm.fbname = authService.fbname;

        vm.loginWithFacebook = loginWithFacebook;

        function loginWithFacebook() {
            console.log("tried facebook user creation with username: " +  vm.username + " and facebook token " + authService.fbtoken);
            if(vm.username && authService.fbtoken) {
                authService.fblogin(authService.fbtoken, vm.username);

                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Welcome!')
                        .textContent('Welcome at Veloo!')
                        .ok('OK'));
            }
            else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Error!')
                        .textContent('Please try again!')
                        .ok('OK'));
            }
        }
    }
})();

