angular.module('Accounting').factory('Student',function($q, Request, $rootScope, Session) {

	return {
        search: function (filter, page) {
            var headers = {
                token: Session.get().token,
                usuario: Session.get().email,
                aplicacion: Session.get().application,
                ip: Session.get().ip
            };
            var deferred = $q.defer();
            var url = $rootScope.Path + 'private/alumno/buscar';
            var data = {
                filtro: filter,
                paginacion: page
            };
            Request.Post(data, url, headers).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    };

});
