(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('mainCtrl', mainCtrl);

    function mainCtrl($scope, $rootScope, $location) {
        var vm = this;

        vm.isFrontPage = isFrontPage;

        vm.setPathTo = $rootScope.setPathTo;
        vm.showLogin = $rootScope.showLogin;
        vm.showSignup = $rootScope.showSignup;
        vm.toggleSidenav = $rootScope.toggleSidenav;

        function isFrontPage() {
            return $location.path() == "/"
        }

    }
})();
