(function () {
    angular.module('velooApi', ['ngResource']);

    var VELOO_DEFAULT_URI = 'http://localhost:3000/';
    var VELOO_DEFAULT_API_ENDPOINT = 'api/';

    angular.module('velooApi').value('velooConnection', {
        baseUri: VELOO_DEFAULT_URI,
        apiUri: VELOO_DEFAULT_URI + VELOO_DEFAULT_API_ENDPOINT
    });

})();

(function () {
    'use strict';

    angular.module('velooApi')
        .factory('velooAuthInterceptor', velooAuthInterceptor)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('velooAuthInterceptor');
        });

    function velooAuthInterceptor(velooConnection, velooToken) {
        return {
            // automatically attach Authorization header
            request: function (config) {

                var token = velooToken.getToken();

                if (token && velooToken.parseJwt(token).exp < new Date().getTime()) {
                    token = null;
                    velooToken.logout();
                }

                if (config.url.indexOf(velooConnection.apiUri) === 0 && token) {
                    config.headers.Authorization = 'JWT ' + token;
                }

                return config;
            },

            response: function (res) {

                if (res.config.url.indexOf(velooConnection.baseUri) === 0 && res.data.token) {
                    velooToken.saveToken(res.data.token);
                }

                return res;
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('velooApi')
        .service('velooToken', velooToken);

    function velooToken($window) {
        return {
            parseJwt: parseJwt,
            saveToken: saveToken,
            getToken: getToken,
            logout: logout,
            isAuthenticated: isAuthenticated,
            getUserdata: getUserdata
        };

        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        }

        function saveToken(token) {
            localStorage['velooToken'] = token;
        }

        function getToken() {
            return localStorage['velooToken'];
        }

        function logout() {
            localStorage.removeItem('velooToken');
        }

        function isAuthenticated() {
            var token = getToken();
            if (token) {
                var params = parseJwt(token);
                return Math.round(new Date().getTime()) <= params.exp;
            } else {
                return false;
            }
        }

        function getUserdata() {
            var token = getToken();
            if (token) {
                var params = parseJwt(token);
                return params.user;
            } else {
                return false;
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('velooApi')
        .service('velooData', velooData);

    function velooData($resource, velooUtil) {

        var Bicycle = $resource(velooUtil.getFullUrl(velooUtil.paths.bicycle + "/:id"),
            {
                id: "@id"
            },
            {
                update: {
                    method: "PUT"
                },
                search: {
                    method: "GET",
                    url: velooUtil.getFullUrl(velooUtil.paths.bicycle + "/search"),
                    isArray: true
                }
            });

        var Picture = $resource(velooUtil.getFullUrl(velooUtil.paths.picture + "/:id"),
            {
                id: "@id"
            });

        var User = $resource(velooUtil.getFullUrl(velooUtil.paths.user), {},
            {
                updateUserDetails: {
                    method: "POST",
                    url: velooUtil.getFullUrl(velooUtil.paths.user),
                    isArray: false
                },
                getUserDetails: {
                    method: "GET",
                    url: velooUtil.getFullUrl(velooUtil.paths.user),
                    isArray: false
                }
            });

        return {
            Bicycle: Bicycle,
            Picture: Picture,
            User: User
        };
    }
})();


(function () {
    'use strict';

    angular.module('velooApi')
        .service('velooUtil', velooUtil);

    function velooUtil(velooConnection) {

        var paths = getPaths();

        return {
            getFullUrl: getFullUrl,
            paths: paths
        };

        function combinePaths(str1, str2) {
            if (str1.charAt(str1.length - 1) === '/') {
                str1 = str1.substr(0, str1.length - 1);
            }

            if (str2.charAt(0) === '/') {
                str2 = str2.substr(1, velooConnection.apiUri.length - 1);
            }

            return str1 + '/' + str2;
        }

        function getFullUrl(urlPart) {
            return combinePaths(velooConnection.apiUri, urlPart);
        }

        function getPaths() {
            return {
                bicycle: 'bicycle',
                picture: 'picture',
                user: 'user'
            };
        }

    }


})();
