(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('showBicycleCtrl', showBicycleCtrl);

    function showBicycleCtrl($scope, uiGmapGoogleMapApi, velooData, $routeParams, $rootScope, $mdDialog, $mdMedia, $mdSidenav, $location) {
        var vm = this;

        vm.showBookingRequest = showBookingRequest;
        vm.sendBooking = sendBooking;
        vm.cancel = cancel;

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

        function sendBooking() {

            velooData.Booking.save({
                startDate: vm.startDate.valueOf(),
                endDate: vm.endDate.valueOf(),
                bicycle: vm.bicycle._id
            }).$promise.then(function (data) {
                console.log("should send message now");
                console.log(data);
                velooData.Message.save({
                    text: vm.bookingText,
                    booking: data._id
                }).$promise.then(function (message) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Booking successful')
                            .ok('OK'));
                    $location.path('/booking/'+ data._id);
                });
            });

        }

        function cancel() {
            $mdDialog.cancel();
        }

    }
})(angular);
