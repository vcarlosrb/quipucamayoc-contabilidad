angular.module('Accounting').controller('ListRefundCtrl',function($scope, Refund, CurrentDate, DataCash, $modalInstance, $modal, CashId){

    $scope.Refunds = {};
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 10,
        changePage: function () {
            $scope.Services.searchRefund();
        }
    };

    $scope.Events = {
        deleteRefund: function(refund) {
            swal({
                title: "Eliminar vuelta",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
            }, function () {
                //vm.Services.deleteStockbroker(stockbroker.codMatricula, index);
            });
        },
        createFlying: function () {
            $modal.open({
                templateUrl: 'modals/Flying/create/createFlying.html',
                controller: 'CreateFlyingCtrl',
                resolve: {
                    CashId: function () {
                        return CashId;
                    }
                }
            }).result.then(function (result) {

            });
        }
    };

    $scope.Services = {
        page: 1,
        loader: false,
        constructor: function() {
            this.getData();
        },
        getData: function () {
            var self = this;
            self.loader = true;
            Refund.listCashTurns(CurrentDate.year, DataCash.codCajaChica, this.page).then(function(response){
                $scope.Pagination.total = parseInt(response.data.paginaciones) * 10;
                $scope.Pagination.current = 1;
                $scope.Refunds = response.data.vueltas;
                self.loader = false;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
                self.loader = false;
            });
        },
        searchRefund: function () {
            var self = this;
            if(self.loader == false) {
                self.loader = true;
                Refund.listCashTurns(CurrentDate.year, DataCash.codCajaChica, $scope.Pagination.current).then(function(response){
                    $scope.Refunds = response.data.vueltas;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        },
        updateRefunds: function() {
            var data = {
                vueltas: JSON.stringify($scope.Refunds)
            };
            Refund.updateCashTurns(data).then(function(response) {
                $modalInstance.close($scope.currentUser);
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        }
    };
    $scope.Services.constructor();

});
