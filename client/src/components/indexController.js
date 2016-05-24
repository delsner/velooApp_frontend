(function (angular) {
    'use strict';

    angular
        .module('swfAngular')
        .controller('indexCtrl', indexCtrl);

    function indexCtrl($scope, $timeout, $q, swfSearchService, swfAuth, swfData, $log, $location, $mdSidenav, $mdMenu, $rootScope, swfUtil, swfAccountService, $anchorScroll) {
        var vm = this;

        vm.loading = false;
        vm.showHowTo = false;

        vm.showAccountMenu = false;

        if (isAuthed()) {
            $rootScope.ownUsername = swfAuth.getUsername();
            swfAccountService.getAvatar($rootScope.ownUsername).then(function (result) {
                vm.myAvatar = result;
            });
            swfData.Person.setLastLogin().$promise.then(function (success) {
                $rootScope.messagesSinceLastLogin = success;
            });
        }

        $rootScope.$watch('loading', function (newValue, oldValue) {
            vm.loading = newValue;
        });

        $rootScope.$watch('ownUsername', function (newValue, oldValue) {
            if (newValue !== undefined) {
                swfAccountService.getAvatar($rootScope.ownUsername).then(function (result) {
                    vm.myAvatar = result;
                });
            }
        });

        $rootScope.$watch('messagesSinceLastLogin', function (newValue, oldValue) {
            console.log("messagesSinceLastLogin has changed to ");
            console.log(newValue);
            vm.messagesSinceLastLogin = newValue;
        });

        vm.setPathTo = setPathTo;
        vm.setPathToWithParams = setPathToWithParams;
        vm.isAuthed = isAuthed;
        vm.logout = $rootScope.logout;
        vm.getUsername = getUsername;
        vm.getSearchHints = getSearchHints;
        vm.searchTextChange = searchTextChange;
        vm.selectedItemChange = selectedItemChange;
        vm.showSearchResults = showSearchResults;
        vm.showLogin = $rootScope.showLogin;
        vm.showSignup = $rootScope.showSignup;
        vm.toggleSidenav = $rootScope.toggleSidenav;
        vm.scrollable = scrollable;
        vm.getOwnUsername = getOwnUsername;
        vm.openMenu = openMenu;
        vm.closeMenu = closeMenu;
        vm.isFrontPage = isFrontPage;
        vm.setShowHowTo = setShowHowTo;

        function setShowHowTo() {
            vm.showHowTo = !vm.showHowTo;
            if (vm.showHowTo) {
                //$location.hash('swf-how-to-anchor');
                $anchorScroll.yOffset = 1000;
                $anchorScroll('content');
            }
        }

        function openMenu($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        }

        function closeMenu() {
            $mdMenu.hide();
        }

        function scrollable() {
            return $mdSidenav('right').isOpen();
        }

        function getOwnUsername() {
            return $rootScope.ownUsername;
        }

        function setPathTo(path) {
            $mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right');
            $location.search({}); //reset searchParams
            if (angular.isString(path)) {
                $location.path(path);
            } else {
                $log.error('path must be of type string. path =', path);
            }
        }

        function setPathToWithParams(path, params) {
            $mdSidenav('right').isOpen() && $rootScope.toggleSidenav('right');
            $location.search({}); //reset searchParams
            $log.warn("setPathTo was called:", path);
            if (angular.isString(path)) {
                $location.path(path).search(params);
            } else {
                $log.error('path must be of type string. path =', path);
            }
        }

        function isAuthed() {
            return swfAuth.isAuthenticated()
        }


        function getUsername() {
            return swfAuth.getUsername();
        }

        function getSearchHints(searchText) {

            var deferred = $q.defer();

            var searchParams = {
                searchText: searchText
            };

            if (vm.timer) {
                $timeout.cancel(vm.timer);
            }
            vm.timer = $timeout(function () {
                swfSearchService.getSearchHints(searchParams, function (success) {
                    deferred.resolve(success.searchResults);

                }, function (error) {
                    $log.info("error searchHints");
                });
            }, 500);

            return deferred.promise;
        }

        function showSearchResults(keyEvent, searchText) {
            if (keyEvent != undefined && keyEvent.which === 13) {

                var searchParams = {
                    searchText: searchText
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

        function isFrontPage() {
            return $location.path() == "/"
        }

    }

})(angular);
