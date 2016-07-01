(function() {
    'use strict';

    angular
        .module('velooAngular')
        .controller('mainCtrl', mainCtrl);

    function mainCtrl($scope, $q, $log, $rootScope, $location, searchService, authService) {
        //variables
        var vm = this;
        vm.loading = false;

        $rootScope.$watch('user', function(newValue, oldValue) {
            vm.user = $rootScope.user;
        });

        $rootScope.$watch('loading', function(newValue, oldValue) {
            vm.loading = newValue;
        });

        //external functions
        vm.setPathTo = $rootScope.setPathTo;
        vm.showLogin = $rootScope.showLogin;
        vm.showSignup = $rootScope.showSignup;
        vm.toggleSidenav = $rootScope.toggleSidenav;
        vm.isAuthenticated = authService.isAuthenticated;
        vm.logout = $rootScope.logout;

        //internal functions
        vm.getSearchHints = getSearchHints;
        vm.showSearchResults = showSearchResults;
        vm.searchTextChange = searchTextChange;
        vm.selectedItemChange = selectedItemChange;
        vm.currentLocation = currentLocation;
        vm.getOwnUsername = getOwnUsername;
        vm.getOwnId = getOwnId;
        vm.isOfTypeRoute = isOfTypeRoute;


        //functions
        function getSearchHints(searchText) {
            var deferred = $q.defer();

            var searchParams = {
                q: searchText
            };

            searchService.getSearchHints(searchParams, function(success) {
                deferred.resolve(success.results);
            }, function(error) {
                $log.info("error searchHints");
            });

            return deferred.promise;
        }

        function showSearchResults(keyEvent, searchText) {
            if (keyEvent != undefined && keyEvent.which === 13 && searchText != "") {
                var searchParams = {
                    q: searchText
                };
                $location.path('search').search(searchParams);
            }
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }

        function currentLocation() {
            return $location.path();
        }

        function getOwnUsername() {
            return authService.getUserdata().username;
        }

        function getOwnId() {
            return authService.getUserdata()._id;
        }

        function isOfTypeRoute(route) {
            return (currentLocation().indexOf(route) > -1);
        }
    }
})();
