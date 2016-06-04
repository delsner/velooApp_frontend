(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('showBicycleCtrl', showBicycleCtrl);

    function showBicycleCtrl($scope, uiGmapGoogleMapApi, velooData, $routeParams) {
        var vm = this;

        velooData.Bicycle.get({id: $routeParams.id}).$promise.then(function (data) {

            vm.bicycle = data;

            console.log(vm.bicycle);

            vm.map = {
                center: {
                    latitude: vm.bicycle.latitude,
                    longitude: vm.bicycle.longitude
                },
                zoom: 12
            };

            vm.marker = {
                id: 0,
                coords: {
                    latitude: vm.bicycle.latitude,
                    longitude: vm.bicycle.longitude
                },
                options: {draggable: false}
            };


            vm.bicycleInformationLeftList = [
                {
                    icon: "euro_symbol",
                    bind: vm.bicycle.price,
                    label: "Price per day: "
                },
                {
                    icon: "format_size",
                    bind: vm.bicycle.size,
                    label: "Size: "
                },
                {
                    icon: "polymer",
                    bind: vm.bicycle.brand,
                    label: "Brand: "
                }

            ];
            vm.bicycleInformationRightList = [
                {
                    icon: "directions_bike",
                    bind: vm.bicycle.type,
                    label: "Bicycle type: "
                },
                {
                    icon: "settings",
                    bind: vm.bicycle.gears,
                    label: "Number of gears: "
                },
                {
                    icon: "supervisor_account",
                    bind: vm.bicycle.category,
                    label: "Bicycle category: "
                }
            ];

        });


    }
})(angular);

