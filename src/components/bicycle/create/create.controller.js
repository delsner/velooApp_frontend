(function(angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('createBicycleCtrl', createBicycleCtrl);

    function createBicycleCtrl($scope, $q, uiGmapGoogleMapApi, velooData, $mdDialog, $rootScope, $http, Upload) {
        var vm = this;

        vm.bicycleTypes = ["Mountainbike", "Racing Bicycle", "Road Bicycle", "Touring Bicycle"];
        vm.bicycleCategories = ["Female", "Male", "Children"];
        vm.bicycleSizes = ["XS", "S", "M", "L", "XL"];
        vm.bicycleFeatures = [
          {
            feature: "Carrier",
            isSelected: false
          },{
            feature: "Lock",
            isSelected: false,
        }, {
            feature: "Helmet",
            isSelected: false,
        }, {
            feature: "Airpump",
            isSelected: false,
        }, {
            feature: "Repairkit",
            isSelected: false,
        }];
        vm.newFeature = "";
        vm.files = [];

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
            options: {
                draggable: false
            }
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
            location: [],
            features: []
        };

        vm.saveBicycle = saveBicycle;
        vm.getGeolocation = getGeolocation;
        vm.addFeature = addFeature;
        vm.deleteFile = deleteFile;
        vm.base64encodeImages = base64encodeImages;

        function saveBicycle() {
            var promise = base64encodeImages();
            promise.then(function(images) {
                vm.bicycle.pictures = images;
                vm.bicycle.features = vm.bicycleFeatures;
                velooData.Bicycle.save(vm.bicycle).$promise.then(function(success) {
                    console.log(vm.bicycle);
                    $rootScope.setPathTo("/bicycle/" + success._id);
                }, function(error) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Bad Input')
                        .textContent('Please check your inputs.')
                        .ok('OK'));
                });
            });
        }

        function addFeature() {
            vm.bicycleFeatures.push({
                feature: vm.newFeature,
                isSelected: true
            });
            vm.newFeature = "";
        }

        function getGeolocation() {
            if (vm.bicycle.street && vm.bicycle.zipcode && vm.bicycle.city) {
                $http.get("http://nominatim.openstreetmap.org/search?format=json&addressdetails=0&q=" +
                    vm.bicycle.street + " " + vm.bicycle.zipcode + " " + vm.bicycle.city).then(function(success) {
                    if (success.data[0]) {
                        vm.marker.coords.latitude = parseFloat(success.data[0].lat);
                        vm.marker.coords.longitude = parseFloat(success.data[0].lon);

                        vm.map.center.latitude = parseFloat(success.data[0].lat);
                        vm.map.center.longitude = parseFloat(success.data[0].lon);
                        vm.map.zoom = 15;

                        vm.bicycle.location[0] = parseFloat(success.data[0].lon);
                        vm.bicycle.location[1] = parseFloat(success.data[0].lat);
                    }
                }, function(error) {

                });
            }
        }

        function deleteFile(index) {
            vm.files.splice(index, 1);
        }

        function base64encodeImages() {
            return $q(function(resolve, reject) {
                var results = [];
                vm.files.forEach(function(e) {
                    var reader = new window.FileReader();
                    reader.readAsDataURL(e);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        results.push({
                            description: e.description ? e.description : e.name,
                            data: reader.result
                        });
                        if (results.length == vm.files.length) {
                            resolve(results);
                            console.log("done");
                        }
                    }
                });

                if (vm.files.length == 0) {
                    resolve(results);
                }
            });
        }
    }
})(angular);
