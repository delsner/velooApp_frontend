(function (angular) {
    'use strict';

    angular
        .module('velooAngular')
        .controller('bicycleCtrl', bicycleCtrl);

    function bicycleCtrl($scope, uiGmapGoogleMapApi) {
        var vm = this;
        vm.bicycleInformationLeftList = [
            {
                icon: "euro_symbol",
                bind: "jdkalsjdklsajdkasjdklasjdkalkl"
            },
            {
                icon: "person",
                bind: "name"
            },
            {
                icon: "landscape",
                bind: "bndajdlkasjd"
            }
        ];
        vm.bicycleInformationRightList = [
            {
                icon: "euro_symbol",
                bind: "jdkalsjdklsajdkasjdklasjdkalkljfjdklsajdkasjdkasljdaskljakdjakldjaskldkasjdkas"
            },
            {
                icon: "euro_symbol",
                bind: "price"
            },
            {
                icon: "euro_symbol",
                bind: "jdkalsjdklsajdkasjdklasjdkalkljfjdklsajdkasjdkasljdaskljakdjakldjaskldkasjdkas"
            }
        ];
        vm.test = "test"
        vm.map = {
            center: {
                latitude: 48.137,
                longitude: 11.577
            },
            zoom: 12
        };
    }
})(angular);

