/*
filename: sidenav.directive.js in main

<veloo-sidenav></veloo-sidenav>
*/

(function (angular) {
    angular
        .module('velooAngular')
        .directive('sidenav', sidenav);

    function sidenav() {
        return {
            scope: "=",
            controller: function ($scope, $mdSidenav) {
                function toggle() {
                    $mdSidenav.close();
                }
            },
            type: 'e',
            templateUrl: '../main/templates/sidenav.tpl.html',
            link: function (scope, attributes, element) {
            }
        }
    }
})(angular);