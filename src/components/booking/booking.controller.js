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
                    $route.reload();
                });
            }
        }

    }
})(angular);

