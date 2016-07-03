(function(angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('showBicycleCtrl', showBicycleCtrl);

    function showBicycleCtrl($scope, uiGmapGoogleMapApi, velooData, $routeParams, $rootScope, $mdDialog, $mdMedia, $mdSidenav, $location) {
        var vm = this;

        vm.showBookingRequest = showBookingRequest;
        vm.sendBooking = sendBooking;
        vm.cancel = cancel;
        vm.showTabDialog = showTabDialog;
        vm.availableFilter = availableFilter;

        velooData.Bicycle.get({
            id: $routeParams.id
        }).$promise.then(function(data) {

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
                options: {
                    draggable: false
                }
            };

            vm.bicycleInformationLeftList = [{
                    icon: "euro_symbol",
                    bind: vm.bicycle.price,
                    label: "Price per day: "
                }, {
                    icon: "format_size",
                    bind: vm.bicycle.size,
                    label: "Size: "
                }, {
                    icon: "polymer",
                    bind: vm.bicycle.brand,
                    label: "Brand: "
                }

            ];
            vm.bicycleInformationRightList = [{
                icon: "directions_bike",
                bind: vm.bicycle.type,
                label: "Bicycle type: "
            }, {
                icon: "settings",
                bind: vm.bicycle.gears,
                label: "Number of gears: "
            }, {
                icon: "supervisor_account",
                bind: vm.bicycle.category,
                label: "Bicycle category: "
            }];

        });

        function showTabDialog(tabIndex) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md'));
            $mdDialog.show({
                controller: DialogSliderController,
                controllerAs: 'ctrl',
                templateUrl: 'components/bicycle/show/templates/pictureSlider.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    tabIndex: tabIndex,
                    bicycle: vm.bicycle
                }
            });

            function DialogSliderController($scope, $window, $mdDialog, tabIndex, bicycle) {
                var vm = this;
                vm.tabIndex = tabIndex;
                vm.bicycle = bicycle;
                vm.cancel = cancel;
                vm.nextTabIndex = nextTabIndex;
                vm.lastTabIndex = lastTabIndex;

                $window.onkeyup = function(e) {
                    var key = e.keyCode ? e.keyCode : e.which;

                    if (key == 37) {
                        lastTabIndex();

                    } else if (key == 39) {
                        nextTabIndex();
                    }
                    $scope.$apply();
                };

                function cancel() {
                    $mdDialog.cancel();
                }

                function nextTabIndex() {
                    if (vm.tabIndex + 1 < vm.bicycle.pictures.length) {
                        vm.tabIndex++;
                    } else {
                        vm.tabIndex = 0;
                    }
                }

                function lastTabIndex() {
                    console.log("last");
                    if (vm.tabIndex - 1 >= 0) {
                        vm.tabIndex--;
                    } else {
                        vm.tabIndex = vm.bicycle.pictures.length - 1;
                    }
                }
            }
        }

        function showBookingRequest() {
            $mdSidenav('right').isOpen() && toggleSidenav('right'); //TODO: unnötig?
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md'));
            $mdDialog.show({
                controller: 'showBicycleCtrl as ctrl',
                templateUrl: 'components/bicycle/show/templates/bookingRequest.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });

        }

        function availableFilter(date) {
            var day = new Date(date);
            var result = true;

            if (vm.bicycle && vm.bicycle.restrictions) {
                if (vm.bicycle.restrictions.length > 0) {
                    vm.bicycle.restrictions.forEach(function(r) {
                        var restriction = new Date(r);
                        if (restriction.getTime() == day.getTime()) {
                            result = false;
                        }
                    });
                }
            }
            if (new Date(date) < new Date()) {
                result = false;
            }
            return result;
        }

        function sendBooking() {

            velooData.Booking.save({
                startDate: vm.startDate.valueOf(),
                endDate: vm.endDate.valueOf(),
                bicycle: vm.bicycle._id
            }).$promise.then(function(data) {
                console.log("should send message now");
                console.log(data);
                velooData.Message.save({
                    text: vm.bookingText,
                    booking: data._id
                }).$promise.then(function(message) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Booking successful')
                        .ok('OK'));
                    $location.path('/booking/' + data._id);
                });
            });

        }

        function cancel() {
            $mdDialog.cancel();
        }

    }
})(angular);
