(function () {
    'use strict';

    angular.module('velooAngular')
        .service('authService', authService);

    function authService(velooConnection, $http, velooToken) {

        return {
            signup: signup,
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            getUserdata: getUserdata
        };

        function login(username, password) {
            console.log('Called login with: ' + username + ', ' + password);
            return $http.post(velooConnection.baseUri + 'login', {
                username: username,
                password: password
            });
        }

        function signup(username, password) {
            console.log('Called signup with: ' + username + ', ' + password);
            return $http.post(velooConnection.baseUri + 'signup', {
                username: username,
                password: password
            });
        }
        

        function isAuthenticated() {
            return velooToken.isAuthenticated();
        }

        function logout() {
            return velooToken.logout();
        }

        function getUserdata() {
            return velooToken.getUserdata();
        }

    }
})();