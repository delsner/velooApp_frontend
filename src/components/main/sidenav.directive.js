/*
filename: sidenav.directive.js in main

<veloo-sidenav></veloo-sidenav>
*/

(function (angular) {
    angular
        .module('velooAngular')
        .directive('sidenav', sidenav);

    function sidenav($rootScope) {
        return {
            scope: {},
            controller: function ($scope, $mdSidenav) {
                var vm = this;

                vm.toggle = $rootScope.toggleSidenav;
            },
            restrict: 'E',
            templateUrl: '../main/templates/sidenav.tpl.html',
            link: function (scope, attributes, element) {
            }
        }
    }
})(angular);