angular.module('Accounting').factory('Request', function ($q, $rootScope, $http, Session) {

    return {
        Post: function (data, url, headers) {
            var deferred = $q.defer();

            $http.post(url, data, {
                headers: headers
            }).then(function (res) {
                Session.restartTime();
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        Get: function (url, headers) {
            var deferred = $q.defer();

            $http.get(url, {
                headers: headers
            }).then(function (res) {
                Session.restartTime();
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        Put: function (data, url, headers) {
            var deferred = $q.defer();

            $http.put(url, data, {
                headers: headers
            }).then(function (res) {
                Session.restartTime();
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        Patch: function (data, url) {
            var deferred = $q.defer();

            $http.patch(url, data).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        Delete: function (url, headers) {
            var deferred = $q.defer();

            $http.delete(url, {
                headers: headers
            }).then(function (res) {
                Session.restartTime();
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    };

});
