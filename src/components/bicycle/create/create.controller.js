(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('createBicycleCtrl', createBicycleCtrl);

    function createBicycleCtrl($scope, uiGmapGoogleMapApi) {
        var vm = this;

        vm.bicycle = {
            price: "",
            type: "",
            size: "",
            gears: "",
            carrier: "",
            brand: "",
            street: "",
            zipcode: "",
            city: "",
            isActive: "",
            description: ""
        };

        vm.map = {
            center: {
                latitude: 48.137,
                longitude: 11.577
            },
            zoom: 12
        };
    }
})(angular);

