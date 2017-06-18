angular.module('Accounting').controller('CreateSettlementCtrl', function ($scope, $modalInstance, Data, Refund) {

    $scope.Form = {};

    $scope.Services = {
        constructor: function () {
            this.getData();
            this.getRefundNumber();
        },
        getData: function () {
            $scope.Form.idCajachica = Data.idCajachica;
        },
        getRefundNumber: function () {
            var date = new Date();
            var data = {
                idCajaChica: parseInt($scope.Form.idCajachica),
                tipoReembolso: 'L',
                anio: date.getFullYear()
            };
            Refund.getRefundNumber(data).then(function (res) {
                $scope.Form.numReembolso = res.data.numReembolso;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });

        },
        create: function (form) {
            var date = new Date();
            var data = {
                tipoReembolso: 'L',
                idCajaChica: parseInt(form.idCajachica),
                mes: date.getMonth() + 1,
                anio: date.getFullYear(),
                numReembolso: form.numReembolso
            };
            Refund.create(data).then(function (res) {
                $modalInstance.close(data);
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        }
    };
    $scope.Services.constructor();

});
