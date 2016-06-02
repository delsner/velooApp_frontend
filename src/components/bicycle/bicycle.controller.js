(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('bicycleCtrl', bicycleCtrl);

    function bicycleCtrl($scope, uiGmapGoogleMapApi) {
        var vm = this;

        vm.map = {
            center: {
                latitude: 48.137,
                longitude: 11.577
            },
            zoom: 12
        };
    }
})(angular);

