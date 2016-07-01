/**
 * Created by Consti on 25.06.16.
 */
(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('bookingCtrl', bookingCtrl);

    function bookingCtrl($scope, $q, uiGmapGoogleMapApi, velooData, $mdDialog, $rootScope, $http, Upload, $routeParams, $route) {
        var vm = this;

        vm.newMessage = "";

        vm.sendMessage = sendMessage;
        vm.getMessages = getMessages;
        vm.getAvatar = getAvatar;
        vm.getMyId = getMyId;

        $rootScope.$watch('user', function(newValue, oldValue) {
            vm.user = $rootScope.user;
        });
        
        velooData.Booking.get({id: $routeParams.id}).$promise.then(function (res) {
            vm.booking = res;
            vm.messageCount = vm.booking.messages.length;
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
            if(vm.booking && $rootScope.user) {
                return $rootScope.user.id == vm.booking.endUser._id ? vm.booking.provider.avatar.data : vm.booking.endUser.avatar.data;
            }
        }
        function getMyId() {
            if($rootScope.user) {
                return $rootScope.user.id;
            }
        }

    }
})(angular);

