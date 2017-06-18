angular.module('Accounting').controller('LoginCtrl', function ($scope, $state, User, Session) {

    $scope.Form = {};
    $scope.Valid = {
        username: false,
        password: false
    };

    $scope.Events = {
        goLogin: function () {
            $state.go('app.private.init.home');
        }
    };

    $scope.Services = {
        loader: false,
        login: function (form) {
            var self = this;
            if ($scope.Validate.login(form) && self.loader==false) {
                self.loader = true;
                var data = {
                    ip: window.IP,
                    aplicacion: '101',
                    usuario: form.username,
                    password: form.password
                };
                User.login(data).then(function (response) {
                    if(response.headers('token')) {
                        var session = {
                            token: response.headers('token'),
                            email: response.data.correo,
                            app: '101',
                            idProfile: response.data.idPerfil,
                            ip: window.IP,
                            idDependence: response.data.idDependencia,
                            dniUser: response.data.dniUsuario,
                            codDependence: response.data.codigoDependencia,
                            descDependence: response.data.descripcionDependencia
                        };
                        Session.set(session);
                        User.setUser(response.data);
                        $state.go('app.private.init.home');
                    } else {
                        self.loader = false;
                        swal("¡Error!", response.data.mensaje, "error");
                    }
                }, function (err) {
                    self.loader = false;
                    swal("¡Error!", err.data.mensaje, "error");
                });
            }
        }
    };

    $scope.Validate = {
        login: function (data) {
            $scope.Valid.username = (data.username == undefined || data.username == '');
            $scope.Valid.password = (data.password == undefined || data.password == '');

            return (!$scope.Valid.username && !$scope.Valid.password);
        }
    };

});
