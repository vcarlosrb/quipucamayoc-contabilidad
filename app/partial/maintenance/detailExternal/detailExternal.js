angular.module('Accounting').controller('DetailexternalCtrl', function ($scope, $state, Provider, $stateParams) {

    $scope.ProviderData = {};
    $scope.originData = {};
    $scope.Valid = {
        ruc: false,
        direccion: false,
        razonSocial: false,
        estado: false,
        nacionProveedor: false,
        nombre: false,
        apePaterno: false,
        apeMaterno: false
    };

    $scope.Events = {
        goProviders: function () {
            $state.go('app.private.init.provider');
        },
        cancelEdit: function () {
            $scope.ProviderData = angular.copy($scope.originData);
        }
    };

    $scope.Services = {
        loader: false,
        constructor: function () {
            this.getData();
        },
        getData: function () {
            Provider.detail($stateParams.ruc).then(function (res) {
                switch (res.data.nacionProveedor) {
                    case 1:
                        res.data.nacionProveedor = '1';
                        break;
                    case 2:
                        res.data.nacionProveedor = '2';
                        break;
                }
                $scope.originData = res.data;
                $scope.ProviderData = angular.copy(res.data);
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        update: function (data) {
            var self = this;
            if ($scope.Validate.update(data) && self.loader == false) {
                self.loader = true;
                Provider.update(data).then(function (res) {
                    $scope.originData = angular.copy(data);
                    self.loader = false;
                    swal("¡Servidor a tercero actualizado!", "", "success");
                }, function (err) {
                    self.loader = false;
                    swal("¡Error!", err.data.mensaje, "error");
                });
            }
        }
    };
    $scope.Services.constructor();

    $scope.Validate = {
        update: function (data) {
            $scope.Valid.ruc = (data.ruc == '' || data.ruc == undefined);
            $scope.Valid.direccion = (data.direccion == '' || data.direccion == undefined);
            $scope.Valid.razonSocial = (data.razonSocial == '' || data.razonSocial == undefined);
            $scope.Valid.estado = (data.estado == '' || data.estado == undefined);
            $scope.Valid.nacionProveedor = (data.nacionProveedor == '' || data.nacionProveedor == undefined);
            $scope.Valid.nombre = (data.nombre == '' || data.nombre == undefined);
            $scope.Valid.apePaterno = (data.apePaterno == '' || data.apePaterno == undefined);
            $scope.Valid.apeMaterno = (data.apeMaterno == '' || data.apeMaterno == undefined);

            return (!$scope.Valid.ruc && !$scope.Valid.direccion && !$scope.Valid.razonSocial && !$scope.Valid.estado && !$scope.Valid.nacionProveedor && !$scope.Valid.nombre && !$scope.Valid.apePaterno && !$scope.Valid.apeMaterno);
        }
    };

});
