(function(angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('editBicycleCtrl', editBicycleCtrl);

    function editBicycleCtrl($scope, $q, uiGmapGoogleMapApi, velooData, $location, $rootScope, $mdDialog, $routeParams, Upload, $http) {
        var vm = this;

        vm.bicycleTypes = ["Mountainbike", "Racing Bicycle", "Road Bicycle", "Touring Bicycle"];
        vm.bicycleCategories = ["Female", "Male", "Children"];
        vm.bicycleSizes = ["XS", "S", "M", "L", "XL"];
        vm.bicycleFeatures = [];
        vm.newFeature = "";
        vm.files = [];

        vm.editBicycle = editBicycle;
        vm.getGeolocation = getGeolocation;
        vm.addFeature = addFeature;
        vm.deleteFile = deleteFile;
        vm.base64encodeImages = base64encodeImages;
        vm.end = end;
        vm.start = start;

        velooData.Bicycle.get({
            id: $routeParams.id
        }).$promise.then(function(data) {

            vm.bicycle = data;
            vm.bicycleFeatures = vm.bicycle.features;
            vm.files = vm.bicycle.pictures;

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
                options: {
                    draggable: false
                }
            };
        });

        function editBicycle() {
            var promise = base64encodeImages();
            promise.then(function(images) {
                vm.bicycle.pictures = images;
                vm.bicycle.features = vm.bicycleFeatures;
                velooData.Bicycle.update({
                    id: $routeParams.id
                }, vm.bicycle).$promise.then(function(success) {
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

        function end() {
            $rootScope.loading = false;
        }

        function start() {
            $rootScope.loading = true;
        }

        function base64encodeImages() {
            var results = [];
            var newPictures = [];
            vm.files.forEach(function(e) {
              if(e._id) {
                results.push({
                    description: e.description ? e.description : e.name,
                    data: e.data
                });
              } else {
                newPictures.push(e);
              }
            });
            return $q(function(resolve, reject) {
                newPictures.forEach(function(e) {
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
