(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('searchCtrl', searchCtrl);

    function searchCtrl(velooData, searchService, $routeParams, $rootScope, $location) {
        var vm = this;

        vm.bicycleTypes = ["Mountainbike", "Racing Bicycle", "Road Bicycle", "Touring Bicycle"];
        vm.bicycleSizes = ["XS", "S", "M", "L", "XL"];

        vm.searchFilter = {
            size: $routeParams.size ? $routeParams.size : "",
            type: $routeParams.type ? $routeParams.type : "",
            startDate: $routeParams.startDate ? $routeParams.startDate : "",
            endDate: $routeParams.endDate ? $routeParams.endDate : "",
            q: $routeParams.q ? $routeParams.q : "",
            page: $routeParams.page ? $routeParams.page : 0
        };

        vm.markers = [];

        $rootScope.loading = true;
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

            searchService
                .getSearchHints(vm.searchFilter, function (data) {

                    if (data) {
                        vm.bicycles = data.results;
                        vm.searchResultsCount = data.resultsCount;
                        vm.paginationAmountOfPages = Math.ceil(data.resultsCount / 10);
                        vm.paginationArray = new Array(vm.paginationAmountOfPages);

                        vm.bicycles.forEach(function (element) {
                            vm.markers.push(
                                {
                                    id: element.id,
                                    coords: {
                                        latitude: element.location[1],
                                        longitude: element.location[0]
                                    },
                                    options: {
                                        draggable: false
                                    },
                                    show: false,
                                    title: element.brand + "-" + element.type
                                }
                            );

                        });

                        if (vm.bicycles[0]) {
                            vm.map = {
                                center: {
                                    latitude: vm.bicycles[1],
                                    longitude: vm.bicycles[0]
                                },
                                zoom: 14
                            };

                            vm.markers[0].show = true;
                        }

                        $rootScope.loading = false;
                    } else {
                        $rootScope.loading = false;
                    }

                }, function (err) {
                    console.log(err);
                });
        }



        function paginationActiveIndex(index) {
            if (vm.offset == 0) {
                return index == 1
            } else {
                return Math.ceil(vm.searchResultsCount / vm.offset) == index
            }
        }


    }
})();