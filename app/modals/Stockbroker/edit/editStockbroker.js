angular.module('Accounting').controller('EditStockbrokerCtrl', function ($scope, Data, $modal, $modalInstance, Stockbroker) {

    $scope.Form = {};
    $scope.currentDependence = {};

    $scope.ModalDependence = {
        show: function () {
            $modal.open({
                templateUrl: 'modals/Dependence/list/listDependence.html',
                controller: 'ListDependenceCtrl'
            }).result.then(function (result) {
                $scope.currentDependence = result;
                $scope.Form.codDependencia = result.codDependencia;
                $scope.Form.descDependencia = result.descDependencia;
                $scope.Form.idDependencia = result.idDependencia;
            });
        }
    };

    $scope.Services = {
        loader: false,
        init: function () {
            this.getData();
        },
        getData: function () {
            $scope.Form = Data;
            $scope.Form.codDependencia = Data.codDependenciaLabora;
            $scope.Form.descDependencia = Data.descDependenciaLabora;
            $scope.Form.idDependencia = null;
        },
        update: function (form) {
            var self = this;
            if (form.idDependencia) {
                var data = {
                    idDependenciaLabora: form.idDependencia,
                    codMatricula: form.codMatricula
                };
                if(self.loader == false) {
                    self.loader = true;
                    Stockbroker.update(data).then(function (res) {
                        $modalInstance.close($scope.currentDependence);
                    }, function (err) {
                        self.loader = false;
                        swal("¡Error!", err.data.mensaje, "error");
                    });
                }
            } else {
                $modalInstance.close();
            }
        }
    };
    $scope.Services.init();

});
