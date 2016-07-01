(function (angular) {
    angular
        .module('velooAngular')
        .directive('messageBox', messageBox);

    function messageBox() {

        return {
            link: function (scope, element, attrs) {
                scope.$watch('ctrl.messageCount', function (newValue, oldValue) {
                        element[0].scrollTop = element[0].scrollHeight;
                });
            }
        };

    }
})(angular);