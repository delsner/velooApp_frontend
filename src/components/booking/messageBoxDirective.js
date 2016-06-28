(function (angular) {
    angular
        .module('velooAngular')
        .directive('messageBox', messageBox);

    function messageBox() {

        return {
            link: function (scope, element, attrs) {
                console.log(scope);
                scope.$watch('ctrl.showMessages', function (newValue, oldValue) {
                    console.log(newValue);
                    if (newValue == true) {
                        console.log(element[0]);
                        console.log(attrs);
                        element[0].scrollTop = element[0].scrollHeight;
                    }
                });
            }
        };

    }
})(angular);