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
                            vm.map = {
                                center: {
                                    latitude: vm.bicycles[0].location[1],
                                    longitude: vm.bicycles[0].location[0]
                                },
                                zoom: 14
                            };

                            vm.markers[0].show = true;
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


    }
})();
