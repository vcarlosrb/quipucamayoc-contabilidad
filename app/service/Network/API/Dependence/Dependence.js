angular.module('Accounting').factory('Dependence',function(Request, $q, $rootScope, Session) {

	return {
        list: function (idRole, idDependence) {
            var headers = {
                token: Session.get().token,
                usuario: Session.get().email,
                aplicacion: Session.get().application,
                ip: Session.get().ip
            };
            var deferred = $q.defer();
            var url = $rootScope.Path + 'private/dependencia/buscar';
            var data = {
                idPerfil: idRole,
                idDependencia: idDependence
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
