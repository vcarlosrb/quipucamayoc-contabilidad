angular.module('Accounting').factory('User',function($q, Request, $rootScope, Session) {

    var UserData = null;
	return {
	    login: function (data) {
            var deferred = $q.defer();
            var url = $rootScope.PathSession + 'public/login/usuarioPrivado';
            Request.Post({},url, data).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        logout: function (data) {
            var deferred = $q.defer();
            var url = $rootScope.PathSession + 'public/logout';
            Request.Post({}, url, data).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        setUser: function (data) {
            UserData = data;
        }
    };

});
