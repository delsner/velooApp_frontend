(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('homeCtrl', homeCtrl);

    function homeCtrl($scope, $rootScope) {
        var vm = this;

        $rootScope.$watch('animateFirstBox', function (newValue, oldValue) {
            if(newValue) {
                console.log("call animate");
                vm.animateElementIn(angular.element(document.querySelector('.v-home-animate-first')));
            }
        });

        $rootScope.$watch('animateSecondBox', function (newValue, oldValue) {
            if(newValue) {
                console.log("call animate");
                vm.animateElementIn(document.querySelector('.v-home-animate-second'));
            }
        });

        vm.animateElementIn = function($el) {
            console.log($el);
            $el.removeClass('v-hidden');
            $el.addClass('animated bounce'); // this example leverages animate.css classes
        };
    }
})();
