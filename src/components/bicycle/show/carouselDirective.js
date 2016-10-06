(function (angular) {
    angular
        .module('velooAngular')
        .directive('pictureSlider', pictureSlider);

    function pictureSlider($rootScope, $compile) {
        return {
            restrict: 'E',
            templateUrl: 'components/bicycle/show/templates/carousel.tpl.html',
            replace: true,
            link: function (scope, element, attrs) {

                        //scope.amountPictures = scope.ctrl.bicycle.pictures.length;
                        scope.selected = [1, 2, 3];

                        for (var i = 0; i < 3; i++) {
                            if (scope.ctrl.bicycle.pictures[i]) {
                                angular.element(document.querySelector('.picture-container').children[i]).css({
                                    'background': 'url(' + scope.ctrl.bicycle.pictures[i].data + ') no-repeat center center', //fixed?
                                    'background-size': 'cover'
                                });
                            } else {
                                angular.element(document.querySelector('.picture-container').children[i]).css({
                                    'background': 'url(./images/tent_icon.png) no-repeat center center', //fixed ?
                                    'background-size': 'cover'
                                });
                            }
                        }

            }
        };
    }
})(angular);
