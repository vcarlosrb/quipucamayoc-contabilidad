angular.module('Accounting').controller('ExpensesCtrl', function ($scope, $state, Refund, $stateParams, Spending) {

    var vm = this;
    $scope.ExpensesData = [];
    //El paginador divide el total de items entre 10 para el total de paginas
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 10,
        changePage: function () {
            $scope.Services.searchPagination();
        }
    };

    vm.Events = {
        goDetail: function (spending) {
            $scope.EventSpending.selectSpending(spending);
            $state.go('app.private.init.refund.structure.detailSpending', {spending: spending.idDocContable});
        },
        deleteSpending: function(spending, index) {
            swal({
                title: "Eliminar Gasto",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
            }, function () {
                $scope.Services.deleteSpending(spending, index);
            });
        }
    };

    $scope.Services = {
        loader: false,
        page: 1,
        constructor: function () {
            this.getData();
        },
        getData: function () {
            var self = this;
            self.loader = true;
            Refund.getExpenseByRefund($stateParams.refund, this.page).then(function (res) {
                res.data.gastos.forEach(function (expense) {
                    expense.monto = expense.monto.toFixed(2);
                });
                $scope.ExpensesData = res.data.gastos;
                $scope.EventSpending.setSpending(res.data.gastos.length);
                $scope.Pagination.total = parseInt(res.data.paginaciones) * 10;
                $scope.Pagination.current = 1;
                self.loader = false;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
                self.loader = false;
            });
        },
        searchPagination: function () {
            var self = this;
            if (self.loader == false) {
                self.loader = true;
                Refund.getExpenseByRefund($stateParams.refund, $scope.Pagination.current).then(function (res) {
                    res.data.gastos.forEach(function (expense) {
                        expense.monto = expense.monto.toFixed(2);
                    });
                    $scope.ExpensesData = res.data.gastos;
                    $scope.EventSpending.setSpending(res.data.gastos.length);
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        },
        deleteSpending: function(spending, index) {
            var data = {
                idGasto: spending.idGasto,
                idReembolso: $stateParams.refund
            };
            Spending.remove(data).then(function(response) {
                $scope.ExpensesData.splice(index,1);
                $scope.currentRefund.montoReembolso = parseFloat($scope.currentRefund.montoReembolso) - parseFloat(spending.monto);
                swal("¡Eliminado!", "Operacion realizada con exito.", "success");
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        }
    };
    $scope.Services.constructor();

});
