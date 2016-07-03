(function() {
    'use strict';

    angular
        .module('velooAngular')
        .controller('searchCtrl', searchCtrl);

    function searchCtrl($scope, velooData, searchService, $routeParams, $rootScope, $location) {
        var vm = this;

        vm.bicycleTypes = ["", "Mountainbike", "Racing Bicycle", "Road Bicycle", "Touring Bicycle"];
        vm.bicycleSizes = ["", "XS", "S", "M", "L", "XL"];
        vm.markers = [];
        vm.map = {
            center: {
                latitude: 48.137,
                longitude: 11.577
            },
            zoom: 12
        };

        vm.searchFilter = {
            size: $routeParams.size ? $routeParams.size : "",
            type: $routeParams.type ? $routeParams.type : "",
            startDate: $routeParams.startDate ? new Date($routeParams.startDate) : "",
            endDate: $routeParams.endDate ? new Date($routeParams.endDate) : "",
            q: $routeParams.q ? $routeParams.q : "",
            page: $routeParams.page ? $routeParams.page : 0
        };

        getSearchResultsWithPaginationOffset(vm.searchFilter.page);

        vm.getSearchResultsWithPaginationOffset = getSearchResultsWithPaginationOffset;
        vm.paginationActiveIndex = paginationActiveIndex;
        vm.showMarkerWindow = showMarkerWindow;
        vm.showSelectedBicycleMarker = showSelectedBicycleMarker;
        vm.hideSelectedBicycleMarker = hideSelectedBicycleMarker;

        function showMarkerWindow(marker, eventName, model) {
            model.show = !model.show;
            console.log(marker);
        }

        function getSearchResultsWithPaginationOffset(page) {

            vm.searchFilter.page = page;

            $location.search(vm.searchFilter);

            $rootScope.loading = true;
            searchService
                .getSearchHints(vm.searchFilter, function(data) {

                    if (data) {
                        vm.bicycles = data.results;
                        vm.searchResultsCount = data.resultsCount;
                        vm.paginationAmountOfPages = Math.ceil(data.resultsCount / 10);
                        vm.paginationArray = new Array(vm.paginationAmountOfPages);
                        vm.markers = [];
                        var counter = 0;
                        vm.bicycles.forEach(function(element) {
                            vm.markers.push({
                                id: counter++,
                                coords: {
                                    latitude: element.location[1],
                                    longitude: element.location[0]
                                },
                                options: {
                                    draggable: false
                                },
                                show: false,
                                title: element.brand + "-" + element.type
                            });

                            element.available = true;

                            if (element.restrictions && element.restrictions.length > 0 && vm.searchFilter.startDate != "" && vm.searchFilter.endDate != "") {
                                element.restrictions.forEach(function(r) {
                                    if (new Date(vm.searchFilter.startDate) <= new Date(r) && new Date(vm.searchFilter.endDate) >= new Date(r)) {
                                        element.available = false;
                                    }
                                });
                            }

                        });

                        if (vm.bicycles[0]) {

                            var mapCenter = {
                                latitude: null,
                                longitude: null
                                };

                            var counter = 0;

                            vm.bicycles.forEach(function(bicycle) {
                                counter++;
                                mapCenter.latitude += bicycle.location[1];
                                mapCenter.longitude += bicycle.location[0];
                            });

                            vm.mapCenter = mapCenter;

                            vm.map = {
                                center: {
                                    latitude: (mapCenter.latitude/counter),
                                    longitude: (mapCenter.longitude/counter)
                                },
                                zoom: 12
                            };

                        }

                        $rootScope.loading = false;
                    } else {
                        $rootScope.loading = false;
                    }

                }, function(err) {
                    $rootScope.loading = false;
                    console.log(err);
                });
        }



        function paginationActiveIndex(index) {
            if (vm.searchFilter.page == 0) {
                return index == 1
            } else {
                return Math.ceil(vm.searchResultsCount / vm.searchFilter.page) == index
            }
        }

        function showSelectedBicycleMarker(id) {
            vm.markers[id].show = true;
            /*vm.map.center.latitude = vm.bicycles[id].location[1];
            vm.map.center.longitude = vm.bicycles[id].location[0];*/
        }

        function hideSelectedBicycleMarker(id) {
            vm.markers[id].show = false;
           /* vm.map.center.latitude = vm.mapCenter.latitude;
            vm.map.center.longitude = vm.mapCenter.longitude;*/
        }
        
    }
})();
