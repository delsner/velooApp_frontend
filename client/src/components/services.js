(function () {
    angular.module('swfApi', ['ngResource']);

    var SWF_DEFAULT_URI = 'http://192.168.0.109:8080/api/';

    angular.module('swfApi').value('swfConnection', {
        baseUri: SWF_DEFAULT_URI
    });

})();

(function () {
    'use strict';

    angular.module('swfApi')
        .factory('swfAuthInterceptor', swfAuthInterceptor)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('swfAuthInterceptor');
        });

    function swfAuthInterceptor(swfConnection, swfToken) {
        return {
            // automatically attach Authorization header
            request: function (config) {

                var token = swfToken.getToken();

                //TODO: catch unauthorized response in case of unauthorized api call
                if (token && swfToken.parseJwt(token).exp * 1000 < new Date()) {
                    token = null;
                    swfToken.logout();
                }

                if (config.url.indexOf(swfConnection.baseUri) === 0 && token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },

            response: function (res) {

                if (res.config.url.indexOf(swfConnection.baseUri) === 0 && res.data.access_token) {
                    swfToken.saveToken(res.data.access_token);
                }

                return res;
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('swfApi')
        .service('swfToken', swfToken);

    function swfToken($window) {
        return {
            parseJwt: parseJwt,
            saveToken: saveToken,
            getToken: getToken,
            logout: logout,
            isAuthenticated: isAuthenticated,
            getUsername: getUsername
        };

        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            //console.log(JSON.parse($window.atob(base64)));
            return JSON.parse($window.atob(base64));
        }

        function saveToken(token) {
            localStorage['jwtToken'] = token;
        }

        function getToken() {
            return localStorage['jwtToken'];
        }

        function logout() {
            localStorage.removeItem('jwtToken');
        }

        function isAuthenticated() {
            var token = getToken();
            if (token) {
                var params = parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp; //TODO: eventuell token hier auch direkt aus localStorage löschen
            } else {
                return false;
            }
        }

        function getUsername() {
            var token = getToken();
            if (token) {
                var params = parseJwt(token);
                return params.sub;
            } else {
                return false;
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('swfApi')
        .service('swfAuth', swfAuth);

    function swfAuth(swfConnection, $http, swfToken, swfData, $log, $mdDialog, $route) {

        return {
            signup: signup,
            signupConfirm: signupConfirm,
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            getUsername: getUsername,
            resetPasswordRequest: resetPasswordRequest,
            resetPassword: resetPassword,
            changePassword: changePassword,
            deletePerson: deletePerson
        };

        function login(username, password) {
            console.log('Called login with: ' + username + ', ' + password);
            return $http.post(swfConnection.baseUri + 'login', {
                username: username,
                password: password
            });
        }

        function signup(username, password, email, firstName, lastName) {
            return swfData.Person.save({
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName
            });
        }

        function signupConfirm(code) {
            console.log('Called signup with: ' + code);
            return swfData.Person.signupConfirm({code: code});
        }

        function isAuthenticated() {
            return swfToken.isAuthenticated();
        }

        function logout() {
            return swfToken.logout();
        }

        function getUsername() {
            return swfToken.getUsername();
        }

        function changePassword(currentPassword, newPassword) {
            return swfData.Person.changePassword({
                currentPassword: currentPassword,
                newPassword: newPassword
            });
        }

        function resetPasswordRequest(email) {
           return swfData.Person.resetPasswordRequest({
               email: email
           });
        }

        function resetPassword(password, code) {
            return swfData.Person.resetPassword({
                password: password,
                code: code
            });
        }

        function deletePerson(password) {
            return swfData.Person.deletePerson({
                password: password
            });
        }
    }
})();


(function () {
    'use strict';

    angular.module('swfApi')
        .service('swfData', swfData);

    function swfData($q, $filter, $resource, swfConnection, swfUtil, $http) {

        var TransactionObject = $resource(swfUtil.getFullUrl(swfUtil.paths.transactionObjects + "/:id"),
            {
                id: "@id"
            },
            {
                update: {
                    method: "PUT"
                },
                search: {
                    method: "GET",
                    url: swfUtil.getFullUrl(swfUtil.paths.transactionObjects + "/search")
                },
                listForOwner: {
                    method: "GET",
                    url: swfUtil.getFullUrl(swfUtil.paths.transactionObjects + "/listForOwner"),
                    isArray: true
                }
            });

        var BookingProcess = $resource(swfUtil.getFullUrl(swfUtil.paths.bookingProcesses + "/:id"),
            {
                id: "@id"
            },
            {
                update: {
                    method: "PUT"
                },
                setMessagesToIsRead: {
                    method: "GET",
                    url: swfUtil.getFullUrl(swfUtil.paths.bookingProcesses + "/setMessagesToIsRead/:id")
                },
                reportToAdmin: {
                    method: "POST",
                    url: swfUtil.getFullUrl(swfUtil.paths.bookingProcesses + "/reportToAdmin/:id")
                }
            });

        var Message = $resource(swfUtil.getFullUrl(swfUtil.paths.messages));

        var Person = $resource(swfUtil.getFullUrl(swfUtil.paths.persons),
            {
                code: "@code"
            },
            {
                updatePerson: {
                    method: "PUT",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/updatePerson/")
                },
                signupConfirm: {
                    method: "GET",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/signupConfirm/:code")
                },
                resetPasswordRequest: {
                    method: "POST",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/resetPasswordRequest/")
                },
                changePassword: {
                    method: "POST",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/changePassword/")
                },
                resetPassword: {
                    method: "POST",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/resetPassword/")
                },
                getAvatar: {
                    method: "GET",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/getAvatar/")
                },
                getPerson: {
                    method: "GET",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/getPerson/")
                },
                setLastLogin: {
                    method: "GET",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/setLastLogin/"),
                    isArray: true
                },
                getMessages: {
                    method: "GET",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/getMessages/"),
                    isArray: true
                },
                deletePerson: {
                    method: "POST",
                    url: swfUtil.getFullUrl(swfUtil.paths.persons + "/deletePerson/"),
                }
            });

        var Rating = $resource(swfUtil.getFullUrl(swfUtil.paths.ratings), null, {
            createRating: {
                method: "POST",
                url: swfUtil.getFullUrl(swfUtil.paths.ratings + "/createRating")
            }
        });

        var Blog = $resource(swfUtil.getFullUrl(swfUtil.paths.blogEntries));

        var Avatar = {
            upload: function (file) {
                var fd = new FormData();
                fd.append('file', file);
                console.log(file);

                return $http.post(swfUtil.getFullUrl(swfUtil.paths.persons + "/uploadAvatar"), fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
            },
            get: function (username) {
                return $http.get(swfUtil.getFullUrl(swfUtil.paths.persons + "/getAvatar/" + username), {
                    cache: true,
                    responseType: "arraybuffer"
                });
            }
        };

        var Pictures = {
            upload: function (id, file) {
                var fd = new FormData();
                fd.append('file', file);

                return $http.post(swfUtil.getFullUrl(swfUtil.paths.transactionObjects + "/uploadPicture" + "/" + id), fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
            },
            get: function (id, pictureId) {
                return $http.get(swfUtil.getFullUrl(swfUtil.paths.transactionObjects + "/pictures/" + id + "/picture/" + pictureId), {
                    cache: true,
                    responseType: "arraybuffer"
                });
            }
        };

        var Certificate = {
            get: function (id) {
                return $http.get(swfUtil.getFullUrl(swfUtil.paths.bookingProcesses + "/getPdf/" + id), {responseType: "arraybuffer"});
            }
        };

        return {
            TransactionObject: TransactionObject,
            BookingProcess: BookingProcess,
            Message: Message,
            Person: Person,
            Rating: Rating,
            Avatar: Avatar,
            Pictures: Pictures,
            Blog: Blog,
            Certificate: Certificate
        };

    }

})();

(function () {
    'use strict';

    angular.module('swfApi')
        .service('swfUtil', swfUtil);

    function swfUtil(swfConnection) {

        var paths = getPaths();

        return {
            getFullUrl: getFullUrl,
            paths: paths,
            arrayBufferToBase64: arrayBufferToBase64
        };

        function arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        function combinePaths(str1, str2) {
            if (str1.charAt(str1.length - 1) === '/') {
                str1 = str1.substr(0, str1.length - 1);
            }

            if (str2.charAt(0) === '/') {
                str2 = str2.substr(1, swfConnection.baseUri.length - 1);
            }

            return str1 + '/' + str2;
        }

        function getFullUrl(urlPart) {
            return combinePaths(swfConnection.baseUri, urlPart);
        }

        function getPaths() {
            return {
                transactionObjects: 'transactionObjects',
                bookingProcesses: 'bookingProcesses',
                messages: 'messages',
                persons: 'persons',
                ratings: 'ratings',
                blogEntries: 'blogEntries'
            };
        }

    }

})();