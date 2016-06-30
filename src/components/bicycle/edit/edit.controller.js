(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('bicycleCtrl', bicycleCtrl);

    function bicycleCtrl($scope, uiGmapGoogleMapApi, velooData, $location,$rootScope, $mdDialog, $routeParams) {
        var vm = this;

        vm.bicycleTypes = ["Mountainbike", "Racing Bicycle", "Road Bicycle", "Touring Bicycle"];
        vm.bicycleCategories = ["Female", "Male", "Children"];
        vm.bicycleSizes = ["XS", "S", "M", "L", "XL"];
        vm.bicycleFeatures = [
            {
                feature: "Lock",
                isSelected: false,
            },
            {
                feature: "Helmet",
                isSelected: false,
            },
            {
                feature: "Airpump",
                isSelected: false,
            },
            {
                feature: "Repairkit",
                isSelected: false,
            }
        ];

        vm.bicycleInformationLeftList = [
            {
                icon: "euro_symbol",
                bind: "jdkalsjdklsajdkasjdklasjdkalkl"
            },
            {
                icon: "person",
                bind: "name"
            },
            {
                icon: "landscape",
                bind: "bndajdlkasjd"
            }
        ];
        vm.bicycleInformationRightList = [
            {
                icon: "euro_symbol",
                bind: "jdkalsjdklsajdkasjdklasjdkalkljfjdklsajdkasjdkasljdaskljakdjakldjaskldkasjdkas"
            },
            {
                icon: "euro_symbol",
                bind: "price"
            },
            {
                icon: "euro_symbol",
                bind: "jdkalsjdklsajdkasjdklasjdkalkljfjdklsajdkasjdkasljdaskljakdjakldjaskldkasjdkas"
            }
        ];
        vm.test = "test"
        vm.map = {
            center: {
                latitude: 48.137,
                longitude: 11.577
            },
            zoom: 12
        };

        velooData.Bicycle.get({id: $routeParams.id}).$promise.then(function (data) {

            vm.bicycle = data;

            console.log(vm.bicycle);

            vm.map = {
                center: {
                    latitude: vm.bicycle.location[1],
                    longitude: vm.bicycle.location[0]
                },
                zoom: 12
            };

            vm.marker = {
                id: 0,
                coords: {
                    latitude: vm.bicycle.location[1],
                    longitude: vm.bicycle.location[0]
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

        function getGeolocation() {
            if (vm.bicycle.street && vm.bicycle.zipcode && vm.bicycle.city) {
                $http.get("http://nominatim.openstreetmap.org/search?format=json&addressdetails=0&q=" +
                    vm.bicycle.street + " " + vm.bicycle.zipcode + " " + vm.bicycle.city).then(function (success) {
                    if (success.data[0]) {
                        vm.marker.coords.latitude = parseFloat(success.data[0].lat);
                        vm.marker.coords.longitude = parseFloat(success.data[0].lon);

                        vm.map.center.latitude = parseFloat(success.data[0].lat);
                        vm.map.center.longitude = parseFloat(success.data[0].lon);
                        vm.map.zoom = 15;

                        vm.bicycle.latitude = parseFloat(success.data[0].lat);
                        vm.bicycle.longitude = parseFloat(success.data[0].lon);
                    }
                }, function (error) {

                });
            }
        }
    }
})(angular);

