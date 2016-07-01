(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('homeCtrl', homeCtrl);

    function homeCtrl($scope, $rootScope, velooData) {
        var vm = this;
        velooData.Bicycle.getBicycles().$promise.then(function (data) {
            vm.bicycles = data;
            console.log(vm.bicycles);
        })
    }
})();
