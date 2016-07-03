(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('accountCtrl', accountCtrl);

    function accountCtrl($scope, $mdDialog, velooData, $mdMedia, authService, $rootScope) {
        var vm = this;

        $rootScope.$watch('user', function (newValue, oldValue) {
            vm.userDetails = $rootScope.user;

            if (vm.userDetails) {
                vm.getBicyclesOfUser();
                vm.getBookingsOfUser();
            }
        });

        $scope.$watch('ctrl.avatar', function (newValue, oldValue) {
            if (newValue) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md'));
                $mdDialog.show({
                    controller: CropDialogController,
                    controllerAs: 'ctrl',
                    templateUrl: 'components/account/templates/crop.tpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        avatar: vm.avatar
                    }
                });
            }

        });

        velooData.User.get().$promise.then(function(res) {
           vm.user = res;
        });

        vm.updateUserDetails = updateUserDetails;
        vm.getBicyclesOfUser = getBicyclesOfUser;
        vm.getBookingsOfUser = getBookingsOfUser;
        vm.getStatusIcon = getStatusIcon;
        vm.getStatusText = getStatusText;

        function getStatusText(status) {
            var statusText = "";
            switch (status) {
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
                    statusText = "Cancelled";
                    break;
                case "STATUS_CANCELLED_BY_END_USER":
                    statusText = "Cancelled";
                    break;
            }
            return statusText;
        }

        function getStatusIcon(status) {
            var statusIcon = "";
            switch (status) {
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


        function getBicyclesOfUser() {
            velooData.Bicycle.getBicyclesOfUser({
                id: vm.userDetails.id
            }).$promise.then(function (res) {
                vm.bicycles = res;
            }, function (err) {
                console.log(err);
            });
        }

        function getBookingsOfUser() {
            velooData.Booking.getBookings().$promise.then(function (res) {
                vm.bookings = res;
                console.log(res);
            })
        }

        function updateUserDetails() {
            velooData.User.updateUserDetails(vm.user).$promise.then(function (success) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Update successful')
                        .textContent('Profile information successfully updated!')
                        .ok('Great'));
                $rootScope.getUserDetails();
            }, function (error) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Bad Input')
                        .textContent('Please check your inputs.')
                        .ok('OK'));
            });
        }

        function CropDialogController($scope, $rootScope, $http, $mdDialog, avatar, Upload, velooUtil) {
            var vm = this;
            vm.avatar = avatar;

            vm.upload = upload;
            vm.cancel = cancel;

            function upload(dataUrl) {

                console.log(dataUrl);

                $http.post(velooUtil.getFullUrl("user/avatar"), {
                    data: dataUrl
                }).then(function (response) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Update successful')
                            .textContent('Profile information successfully updated!')
                            .ok('OK'));
                    $rootScope.getUserDetails();
                }, function (response) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Fehler beim Upload')
                            .textContent('Bitte verwenden Sie ein Bild mit Größe < 5 Mb mit einem der Formate png/jpg/jpeg/gif.')
                            .ok('OK'));
                }, function (evt) {
                    vm.determinateValue = parseInt(100.0 * evt.loaded / evt.total);
                });
            }

            function cancel() {
                $mdDialog.cancel();
            }

        }
    }
})();
