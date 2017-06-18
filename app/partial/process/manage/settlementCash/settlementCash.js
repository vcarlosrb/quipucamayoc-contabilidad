angular.module('Accounting').controller('SettlementcashCtrl',function($scope, $modal, $state, Refund){

    var vm = this;
    $scope.Refunds = {};
    $scope.idCajaChica = '261';
    var currentDate = {};
    //El paginador divide el total de items entre 10 para el total de paginas
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 10,
        changePage: function () {
            $scope.Services.searchPagination();
        }
    };

    $state.go('app.private.init.refund.init');

    vm.ModalRefund = {
        show: function () {
            $modal.open({
                templateUrl: 'modals/Refund/create/createRefund.html',
                controller: 'CreateRefundCtrl',
                resolve: {
                    Data: function () {
                        return {
                            idCajachica: $scope.idCajaChica
                        };
                    }
                }
            }).result.then(function (result) {
                // var date = moment(new Date()).add(2, 'days');
                // var refund = {
                //     mes: result.mes,
                //     codEstadoReembolso: 'N',
                //     fechaCreacion: moment(date).format('DD/MM/YYYY'),
                //     montoReembolso: 0,
                //     numReembolso: result.numReembolso,
                //     tipoReembolso: result.tipoReembolso
                // };
                // $scope.Refunds.reverse();
                // $scope.Refunds.push(refund);
                // $scope.Refunds.reverse();
                $scope.Services.getData();
                swal("¡Reembolso creado!", "", "success");
            });
        },
        settlement: function () {
            $modal.open({
                templateUrl: 'modals/Refund/settlement/createSettlement.html',
                controller: 'CreateSettlementCtrl',
                resolve: {
                    Data: function () {
                        return {
                            idCajachica: $scope.idCajaChica
                        };
                    }
                }
            }).result.then(function (result) {
                $scope.Services.getData();
                swal("¡Caja chica liquidada!", "", "success");
            });
        }
    };

    vm.Events = {
        selectRefund: function (event, idRefund) {
            $state.go('app.private.init.refund.structure.expenses', {refund: idRefund});
            $(event.currentTarget).parent().parent().parent().find('tr').removeClass('blockImportant');
            $('.pr--Refund__buttons').slideUp(200, function () {
                $(event.currentTarget).parent().parent().parent().addClass('blockImportant').parent().find('tr').slideUp(200);
                $('.rCaption').slideUp(200);
                $('.Pagination').slideUp(200);
            });
            setTimeout(function () {
                $('.Refund__variable').slideDown(200);
            }, 800);
        },
        closeRefund: function () {
            $state.go('app.private.init.refund.init');
            $('.Refund__variable').slideUp(200);
            setTimeout(function () {
                $('.pr--Refund__buttons').slideDown(200, function () {
                    $('.Refund--table tbody tr').removeClass('blockImportant').slideDown(200);
                    $('.rCaption').slideDown(200);
                    $('.Pagination').slideDown(200);
                });
            }, 400);
        },
        goAccountingSpending: function (event, idRefund) {
            $state.go('app.private.init.refund.structure.accountingSpending', {refund: idRefund});
            $(event.currentTarget).parent().parent().parent().find('tr').removeClass('blockImportant');
            $('.pr--Refund__buttons').slideUp(200, function () {
                $(event.currentTarget).parent().parent().parent().addClass('blockImportant').parent().find('tr').slideUp(200);
                $('.rCaption').slideUp(200);
                $('.Pagination').slideUp(200);
            });
            setTimeout(function () {
                $('.Refund__variable').slideDown(200);
            }, 800);
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
            Refund.getByTime($scope.idCajaChica, currentDate.month.id, currentDate.year, this.page).then(function (res) {
                if (res.data.reembolsos.length > 0) {
                    res.data.reembolsos.forEach(function (obj) {
                        obj.fechaCreacion = moment(obj.fechaCreacion).format('DD/MM/YYYY - h:mm:ss a');
                    });
                }
                $scope.Pagination.total = parseInt(res.data.paginaciones)*10;
                $scope.Pagination.current = 1;
                $scope.Refunds = res.data.reembolsos;
                self.loader = false;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
                self.loader = false;
            });
        },
        searchPagination: function () {
            var self = this;
            if(self.loader == false) {
                self.loader = true;
                Refund.getByTime($scope.idCajaChica, currentDate.month.id, currentDate.year, $scope.Pagination.current).then(function (res) {
                    if (res.data.reembolsos.length > 0) {
                        res.data.reembolsos.forEach(function (obj) {
                            obj.fechaCreacion = moment(obj.fechaCreacion).format('DD/MM/YYYY - h:mm:ss a');
                        });
                    }
                    $scope.Refunds = res.data.reembolsos;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        },
        updateState: function (refund) {
            Refund.updateState(refund.idReembolso, 2, refund.tipoReembolso).then(function (response) {
                console.log(response,'cerrar')
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        }
    };

    $scope.$watch('DateGlobal', function(nw, old) {
        currentDate = nw;
        $scope.Services.constructor();
    });

});
