(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('createBicycleCtrl', createBicycleCtrl);

    function createBicycleCtrl($scope, uiGmapGoogleMapApi, velooData, $mdDialog, $rootScope, $http) {
        var vm = this;

        vm.saveBicycle = saveBicycle;
        vm.getGeolocation = getGeolocation;
        vm.addFeature = addFeature;

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
        vm.newFeature = "";
        vm.newFeatures = [];

        vm.map = {
            center: {
                latitude: 48.137,
                longitude: 11.577
            },
            zoom: 12
        };

        vm.marker = {
            id: 0,
            coords: {
                latitude: 48.137,
                longitude: 11.577
            },
            options: {draggable: false}
        };

        vm.bicycle = {
            price: null,
            type: "",
            size: "",
            gears: null,
            carrier: false,
            brand: "",
            street: null,
            zipcode: null,
            city: null,
            isActive: false,
            description: "",
            category: "",
            latitude: vm.marker.coords.latitude,
            longitude: vm.marker.coords.longitude,
            featureArray: vm.bicycleFeatures.concat(vm.newFeatures)
        };

        function saveBicycle() {
            velooData.Bicycle.save(vm.bicycle).$promise.then(function (success) {
                $rootScope.setPathTo("/bicycle/" + success.id)
            }, function (error) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Fehlerhafte Eingaben')
                        .textContent('Bitte überprüfen Sie Ihre Eingaben.')
                        .ok('OK'));
            });
        }
        
        function addFeature() {
            vm.newFeatures.push({feature: vm.newFeature, isSelected: true});
            vm.newFeature = "";
        }

        function getGeolocation() {
            if (vm.bicycle.street && vm.bicycle.zipcode && vm.bicycle.city) {
                console.log('now');
                $http.get("http://nominatim.openstreetmap.org/search?format=json&addressdetails=0&q=" +
                    vm.bicycle.street + " " + vm.bicycle.zipcode + " " + vm.bicycle.city).then(function (success) {
                    if (success.data[0]) {
                        vm.marker.coords.latitude = parseFloat(success.data[0].lat);
                        vm.marker.coords.longitude = parseFloat(success.data[0].lon);

                        vm.map.center.latitude = parseFloat(success.data[0].lat);
                        vm.map.center.longitude = parseFloat(success.data[0].lon);
                    }
                }, function (error) {

                });
            }

        }
    }
})(angular);

