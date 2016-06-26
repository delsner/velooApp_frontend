(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('fbloginCtrl', fbloginCtrl);

    function fbloginCtrl( $mdDialog) {
        var vm = this;

        vm.detailFrame = $sce.trustAsResourceUrl("http://google.de");

    }
})();