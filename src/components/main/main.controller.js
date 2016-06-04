(function () {
    'use strict';

    angular
        .module('velooAngular')
        .controller('mainCtrl', mainCtrl);

    function mainCtrl($scope, $q, $log, $rootScope, $location, searchService, authService) {
        //variables
        var vm = this;

        //external functions
        vm.setPathTo = $rootScope.setPathTo;
        vm.showLogin = $rootScope.showLogin;
        vm.showSignup = $rootScope.showSignup;
        vm.toggleSidenav = $rootScope.toggleSidenav;
        vm.isAuthenticated = authService.isAuthenticated;
        vm.logout = $rootScope.logout;

        //internal functions
        vm.isFrontPage = isFrontPage;
        vm.getSearchHints = getSearchHints;
        vm.showSearchResults = showSearchResults;
        vm.searchTextChange = searchTextChange;
        vm.selectedItemChange = selectedItemChange;

        //functions
        function isFrontPage() {
            return $location.path() == "/"
        }

        function getSearchHints(searchText) {
            var deferred = $q.defer();

            var searchParams = {
                searchText: searchText
            };

            searchService.getSearchHints(searchParams, function (success) {
                deferred.resolve(success);
            }, function (error) {
                $log.info("error searchHints");
            });

            return deferred.promise;
        }

        function showSearchResults(keyEvent, searchText) {
            console.log("Normally I would go to search results page now");
            /*if (keyEvent != undefined && keyEvent.which === 13) {

             var searchParams = {
             searchText: searchText
             };

             $location.path('search').search(searchParams);
             }*/
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }
    }
})();
