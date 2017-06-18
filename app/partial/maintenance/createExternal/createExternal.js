angular.module('Accounting').controller('CreateexternalCtrl', function ($scope, $state, Provider, Session, Sunat) {

    var vm = this;

    $scope.idProfile = Session.get().idProfile;

    $scope.Form = {
        estado: 'P',
        tipoPersona: 'S'
    };
    $scope.Valid = {
        ruc: false,
        direccion: false,
        estado: false,
        nacionProveedor: false,
        tipoPersona: false,
        nombre: false,
        apePaterno: false,
        apeMaterno: false
    };

    $scope.Events = {
        goProviders: function () {
            $state.go('app.private.init.provider');
        },
        requestRuc: function (ruc) {
            if(ruc != '' && ruc != undefined) {
                Sunat.ruc({ruc: ruc}).then(function (response) {
                    $scope.Form.direccion = response.data.direccion;
                    $scope.Form.nombre = response.data.nombres;
                    $scope.Form.apePaterno = response.data.apePaterno;
                    $scope.Form.apeMaterno = response.data.apeMaterno;
                    $scope.Form.ruc = response.data.ruc;
                });
            }
        }
    };

    vm.Services = {
        loader: false,
        create: function (data) {
            var self = this;
            if($scope.Validate.update(data) && self.loader == false) {
                self.loader = true;
                Provider.create(data).then(function (response) {
                    swal("¡Servidor a tercero creado!", "", "success");
                    self.loader = false;
                    $state.go('app.private.init.provider');
                }, function (err) {
                    self.loader = false;
                    swal("¡Error!", err.data.mensaje, "error");
                });
            }
        }
    };

    $scope.Validate = {
        update: function (data) {
            $scope.Valid.ruc = (data.ruc == '' || data.ruc == undefined);
            $scope.Valid.direccion = (data.direccion == '' || data.direccion == undefined);
            $scope.Valid.estado = (data.estado == '' || data.estado == undefined);
            $scope.Valid.nacionProveedor = (data.nacionProveedor == '' || data.nacionProveedor == undefined);
            $scope.Valid.tipoPersona = (data.tipoPersona == '' || data.tipoPersona == undefined);
            $scope.Valid.nombre = (data.nombre == '' || data.nombre == undefined);
            $scope.Valid.apePaterno = (data.apePaterno == '' || data.apePaterno == undefined);
            $scope.Valid.apeMaterno = (data.apeMaterno == '' || data.apeMaterno == undefined);

            return (!$scope.Valid.ruc && !$scope.Valid.direccion && !$scope.Valid.estado && !$scope.Valid.nacionProveedor && !$scope.Valid.tipoPersona && !$scope.Valid.nombre && !$scope.Valid.apePaterno && !$scope.Valid.apeMaterno);
        }
    };

});
