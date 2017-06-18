angular.module('Accounting').controller('CreateproviderCtrl', function ($scope, $state, Provider, Sunat) {

    var vm = this;

    $scope.Form = {
        estado: 'P',
        tipoPersona: 'P'
    };
    $scope.Valid = {
        ruc: false,
        direccion: false,
        razonSocial: false,
        estado: false,
        nacionProveedor: false,
        tipoPersona: false
    };

    $scope.Events = {
        goProviders: function () {
            $state.go('app.private.init.provider');
        },
        requestRuc: function (ruc) {
            if(ruc != '' && ruc != undefined) {
                Sunat.ruc({ruc: ruc}).then(function (response) {
                    $scope.Form.direccion = response.data.direccion;
                    $scope.Form.razonSocial = response.data.razonSocial;
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
                    swal("¡Proveedor creado!", "", "success");
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
            $scope.Valid.razonSocial = (data.razonSocial == '' || data.razonSocial == undefined);
            $scope.Valid.estado = (data.estado == '' || data.estado == undefined);
            $scope.Valid.nacionProveedor = (data.nacionProveedor == '' || data.nacionProveedor == undefined);
            $scope.Valid.tipoPersona = (data.tipoPersona == '' || data.tipoPersona == undefined);

            return (!$scope.Valid.ruc && !$scope.Valid.direccion && !$scope.Valid.razonSocial && !$scope.Valid.estado && !$scope.Valid.nacionProveedor && !$scope.Valid.tipoPersona);
        }
    };

});
