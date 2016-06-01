(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('mainCtrl', mainCtrl);

    function mainCtrl($scope, $rootScope, $location) {
        var vm = this;

        vm.isFrontPage = isFrontPage;

        vm.setPathTo = $rootScope.setPathTo;
        vm.toggleSidenav = $rootScope.toggleSidenav;

        function isFrontPage() {
            return $location.path() == "/"
        }

    }
})(angular);
