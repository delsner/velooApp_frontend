(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('bicycleCtrl', bicycleCtrl);

    function bicycleCtrl($scope, $q, uiGmapGoogleMapApi, velooData, $location,$rootScope, $mdDialog, $routeParams, Upload, $http) {
        var vm = this;

        vm.saveBicycle = saveBicycle;
        vm.addFeature = addFeature;
        vm.deleteFile = deleteFile;
        //vm.base64encodeImages = base64encodeImages;
        vm.getGeolocation = getGeolocation;
        vm.files = [];
        vm.images = [];

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

        vm.marker = {
            id: 0,
            coords: {
                latitude: 48.137,
                longitude: 11.577
            },
            options: {draggable: false}
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

            vm.bicycleFeatures.push(vm.bicycle.features);
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

        function deleteFile(index) {
            vm.files.splice(index, 1);
        }

        function addFeature() {
            vm.newFeatures.push({feature: vm.newFeature, isSelected: true});
            vm.newFeature = "";
        }

        /*
        function base64encodeImages() {
            return $q(function (resolve, reject) {
                var results = [];
                if(vm.files.length > 0) {
                    vm.files.forEach(function (e) {
                        var reader = new window.FileReader();
                        reader.readAsDataURL(e);
                        reader.onloadend = function () {
                            var base64data = reader.result;
                            results.push({description: e.description ? e.description : e.name, data: reader.result});
                            if (results.length == vm.files.length) {
                                resolve(results);
                                console.log("done");
                            }
                        }
                    });
                }
            });
        }
*/
        function saveBicycle() {
            /*var promise = base64encodeImages();
            promise.then(function (images) {
            */
            getGeolocation();
                console.log(vm.bicycle);
                //vm.bicycle.images = images;
                vm.bicycle.featureArray = vm.bicycleFeatures.concat(vm.newFeatures);
                vm.bicycle.location = [vm.bicycle.longitude, vm.bicycle.latitude];
                velooData.Bicycle.updateBicycle({id: $routeParams.id}, vm.bicycle).$promise.then(function (success) {
                    console.log(vm.bicycle);
                    $rootScope.setPathTo("/bicycle/" + success._id);
                }, function (error) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Bad Input')
                            .textContent('Please check your inputs.')
                            .ok('OK'));
                });
            //});
        }

    }
})(angular);

