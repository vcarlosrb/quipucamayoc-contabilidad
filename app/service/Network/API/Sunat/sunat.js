angular.module('Accounting').factory('Sunat',function($q, $rootScope, Request) {

    return {
        ruc: function (data) {
            var deferred = $q.defer();
            var url = $rootScope.PathSunat + 'public/sunat/consultaRuc';
            Request.Post({},url, data).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    };
});
