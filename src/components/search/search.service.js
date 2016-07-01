(function () {
    'use strict';

    angular.module('velooAngular')
        .service('searchService', searchService);

    function searchService($log, $q, velooData, $http) {

        return {
            getSearchHints: getSearchHints
        };

        function getSearchHints(params, callback, error) {

            var deferred = $q.defer();
            
            velooData.Bicycle.search(params).$promise.then(function (res) {
                $log.warn('Results:');
                $log.warn(res);
                if (callback && angular.isFunction(callback)) {
                    res = callback(res);
                }
                deferred.resolve(res);
            }, function (err) {
                $log.warn(err);
                if (error && angular.isFunction(error)) {
                    err = error(err);
                }
                deferred.reject(err);
            });

            return deferred;
        }
    }

})();