(function () {
    angular.module('velooApi', ['ngResource']);

    var VELOO_DEFAULT_URI = 'http://localhost:3000/api/';

    angular.module('velooApi').value('velooConnection', {
        baseUri: VELOO_DEFAULT_URI
    });

})();

