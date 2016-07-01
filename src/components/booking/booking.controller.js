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
        
        velooData.Booking.get({id: $routeParams.id}).$promise.then(function (success) {
            console.log(success);
            vm.booking = success;
        });

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

