/**
 * Created by Consti on 25.06.16.
 */
(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('bookingCtrl', bookingCtrl);

    function bookingCtrl(velooData, $mdDialog, $rootScope, $routeParams, $route, $mdMedia) {
        var vm = this;

        vm.newMessage = "";
        vm.statusIcon = "";
        vm.statusText = "";
        vm.rating = 0;
        vm.ratingText = '';
        vm.hoverRating = 0;

        vm.getBooking = getBooking;
        vm.sendMessage = sendMessage;
        vm.getMessages = getMessages;
        vm.getAvatar = getAvatar;
        vm.getStatusIcon = getStatusIcon;
        vm.getStatusText = getStatusText;
        vm.rateBooking = rateBooking;
        vm.setRating = setRating;
        vm.cancel = cancel;
        vm.showRatingDialog = showRatingDialog;
        vm.cancelBooking = cancelBooking;

        $rootScope.$watch('user', function (newValue, oldValue) {
            vm.user = $rootScope.user;
        });

        vm.getBooking();

        function getBooking() {
            velooData.Booking.get({id: $routeParams.id}).$promise.then(function (res) {
                console.log(res);
                vm.booking = res;
                vm.messageCount = vm.booking.messages.length;
                vm.statusIcon = getStatusIcon();
                vm.statusText = getStatusText();
                vm.marker = {
                    id: 0,
                    coords: {
                        latitude: vm.booking.bicycle.location[1],
                        longitude: vm.booking.bicycle.location[0]
                    },
                    options: {draggable: false}
                };
                vm.map = {
                    center: {
                        latitude: vm.booking.bicycle.location[1],
                        longitude: vm.booking.bicycle.location[0]
                    },
                    zoom: 14
                };
            });
        }

        function sendMessage() {

            if (vm.newMessage) {
                velooData.Message.save({
                    text: vm.newMessage,
                    booking: vm.booking._id
                }).$promise.then(function (data) {
                    vm.getMessages();
                    vm.newMessage = "";
                });
            }
        }

        function getMessages() {
            velooData.Message.get({
                id: $routeParams.id
            }).$promise.then(function (res) {
                vm.booking.messages = res;
                vm.messageCount = vm.booking.messages.length;
            });

        }

        function getAvatar() {
            if (vm.booking && $rootScope.user) {
                return $rootScope.user.id == vm.booking.endUser._id ? vm.booking.provider.avatar.data : vm.booking.endUser.avatar.data;
            }
        }

        function rateBooking() {
            velooData.Booking.rateBooking({id:vm.booking._id},{
                ratingText: vm.ratingText,
                starRating: vm.rating
            }).$promise.then(function (success) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Success')
                        .textContent('Booking successfully rated.')
                        .ok('OK'));
            }, function (error) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent('Please try again later.')
                        .ok('OK'));
            })
        }

        function cancelBooking(ev) {

            var confirm = $mdDialog.confirm()
                .title('Cancel booking')
                .textContent('Do you really want to cancel this booking?')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function () {
                velooData.Booking.cancelBooking({
                    id: $routeParams.id,
                    user: vm.user.id
                }).$promise.then(function (success) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Success')
                            .textContent('Booking successfully cancelled.')
                            .ok('OK'));
                    vm.getBooking();
                }, function (error) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Error')
                            .textContent('Please try again later.')
                            .ok('OK'));
                })
            });
        }

        function getStatusIcon() {
            var statusIcon = "";
            switch (vm.booking.status) {
                case "STATUS_CONFIRMED":
                    statusIcon = "check_circle";
                    break;
                case "STATUS_RATEABLE":
                    statusIcon = "stars";
                    break;
                case "STATUS_FINISHED":
                    statusIcon = "done_all";
                    break;
                case "STATUS_CANCELLED_BY_PROVIDER":
                    statusIcon = "cancel";
                    break;
                case "STATUS_CANCELLED_BY_END_USER":
                    statusIcon = "cancel";
                    break;
            }
            return statusIcon;
        }

        function getStatusText() {
            var statusText = "";
            switch (vm.booking.status) {
                case "STATUS_CONFIRMED":
                    statusText = "Confirmed";
                    break;
                case "STATUS_RATEABLE":
                    statusText = "Rateable";
                    break;
                case "STATUS_FINISHED":
                    statusText = "Finished";
                    break;
                case "STATUS_CANCELLED_BY_PROVIDER":
                    statusText = vm.user.id == vm.booking.provider._id ? "Cancelled by me" : "Cancelled by " + vm.booking.provider.username;
                    break;
                case "STATUS_CANCELLED_BY_END_USER":
                    statusText = vm.user.id == vm.booking.endUser._id ? "Cancelled by me" : "Cancelled by " + vm.booking.provider.username;
                    break;
            }
            return statusText;
        }

        function showRatingDialog() {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md'));
            $mdDialog.show({
                controller: 'bookingCtrl as ctrl',
                templateUrl: 'components/booking/templates/rating.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        }

        function setRating(rating) {
            vm.rating = rating;
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})(angular);
