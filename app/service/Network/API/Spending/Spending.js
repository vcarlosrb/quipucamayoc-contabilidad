angular.module('Accounting').factory('Spending',function($q, Request, $rootScope, Session) {

	return {
	    create: function (data) {
            var headers = {
                token: Session.get().token,
                usuario: Session.get().email,
                aplicacion: Session.get().application,
                ip: Session.get().ip
            };
            var deferred = $q.defer();
            var url = $rootScope.Path + 'private/gasto/grabar';
            Request.Post(data, url, headers).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        remove: function(data) {
            var headers = {
                token: Session.get().token,
                usuario: Session.get().email,
                aplicacion: Session.get().application,
                ip: Session.get().ip
            };
            var deferred = $q.defer();
            var url = $rootScope.Path + 'private/gasto/eliminar';
            Request.Put(data, url, headers).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        getSorter: function() {
            var headers = {
                token: Session.get().token,
                usuario: Session.get().email,
                aplicacion: Session.get().application,
                ip: Session.get().ip
            };
            var deferred = $q.defer();
            var url = $rootScope.Path + 'private/docContDetalle/detalle/mostrarClasificadores';
            Request.Get(url, headers).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        getDependencies: function (idDocContable) {
            var headers = {
                token: Session.get().token,
                usuario: Session.get().email,
                aplicacion: Session.get().application,
                ip: Session.get().ip
            };
            var deferred = $q.defer();
            var url = $rootScope.Path + 'private/docContable/detalleDependencia/'+idDocContable;
            Request.Get(url, headers).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        },
        update: function (data) {
            var headers = {
                token: Session.get().token,
                usuario: Session.get().email,
                aplicacion: Session.get().application,
                ip: Session.get().ip
            };
            var deferred = $q.defer();
            var url = $rootScope.Path + 'private/gasto/actualizar';
            Request.Put(data, url, headers).then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    };

});
