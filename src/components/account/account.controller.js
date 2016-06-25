(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('accountCtrl', accountCtrl);

    function accountCtrl($scope, $mdDialog, velooData, $mdMedia) {
        var vm = this;

        vm.updateUserDetails = updateUserDetails;

        velooData.User.getUserDetails().$promise.then(function(data){

            vm.user = data;

            console.log(vm.user);

            });

        function updateUserDetails() {
            velooData.User.updateUserDetails(vm.user).$promise.then(function (success){
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title('Success!')
                        .textContent('Welcome at Veloo!')
                        .ok('OK'));
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
                            .title('Profil information updated')
                            .textContent('Ihre Profildaten wurden erfolgreich geändert.')
                            .ok('OK'));
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