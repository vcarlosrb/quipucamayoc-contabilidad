angular.module('Accounting').controller('ExpensesvalidateCtrl',function($scope, $state, Refund, $stateParams, Spending){

    var vm = this;
    $scope.ExpensesData = [];
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
            $state.go('app.private.init.refundValidate.structure.detailSpending', {spending: spending});
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
            if(self.loader == false) {
                self.loader = true;
                var data = {
                    idReembolso: $stateParams.refund,
                    paginacion: this.page
                };
                Refund.getExpensesByRefundValidate(data).then(function (res) {
                    $scope.ExpensesData = res.data.gastos;
                    $scope.Pagination.total = parseInt(res.data.paginaciones) * 10;
                    $scope.Pagination.current = 1;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        },
        searchPagination: function () {
            var self = this;
            if (self.loader == false) {
                self.loader = true;
                var data = {
                    idReembolso: $stateParams.refund,
                    paginacion: $scope.Pagination.current
                };
                Refund.getExpensesByRefundValidate(data).then(function (res) {
                    $scope.ExpensesData = res.data.gastos;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        }
    };
    $scope.Services.constructor();

});
