(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('homeCtrl', homeCtrl);

    function homeCtrl($scope, $rootScope) {
        var vm = this;

        $rootScope.$watch('animateFirstBox', function (newValue, oldValue) {
            if(newValue) {
                console.log("call animate");
            }
        })
    }
})();
