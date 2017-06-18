angular.module('Accounting').controller('RefundvalidateCtrl', function ($scope, $modal, $state, Refund, $rootScope, Session, Cash) {

    var vm = this;
    $scope.ProfileId = Session.get().idProfile;
    $scope.Refunds = {};
    $scope.idCajaChica = '261';
    $scope.cajaChicaDetail = null;
    $scope.currentRefund = null;
    $scope.Search = {};
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

    $state.go('app.private.init.refundValidate.init');

    vm.Events = {
        clearSearchOpening: function () {
            $scope.Search = {};
            $scope.Services.getData();
        },
        selectRefund: function (event, idRefund) {
            $state.go('app.private.init.refundValidate.structure.expenses', {refund: idRefund});
            $(event.currentTarget).parent().parent().parent().find('tr').removeClass('blockImportant');
            $(event.currentTarget).parent().parent().parent().addClass('blockImportant').parent().find('tr').slideUp(200);
            $('.rCaption').slideUp(200);
            $('.Pagination').slideUp(200);
            setTimeout(function () {
                $('.Refund__variable').slideDown(200);
            }, 400);
        },
        closeRefund: function () {
            $state.go('app.private.init.refundValidate.init');
            $('.Refund__variable').slideUp(200, function () {
                $('.Refund--table tbody tr').removeClass('blockImportant').slideDown(200);
                $('.rCaption').slideDown(200);
                $('.Pagination').slideDown(200);
            });
        },
        summaryByItem: function (refund) {
            var data = {
                param_cch: $scope.idCajaChica,
                param_ree: refund.idReembolso.toString(),
                param_usuario: Session.get().email,
                param_reeMes: currentDate.month.id.toString()
            };
            var url = $rootScope.Path + 'public/reporte/resumenxPartidaPDF?param_cch=' + data.param_cch + '&param_ree=' + data.param_ree + '&param_usuario=' + data.param_usuario + '&param_reeMes=' + data.param_reeMes;
            window.open(url, '_blank');
        },
        detailedListing: function (refund) {
            var data = {
                param_cch: $scope.idCajaChica,
                param_ree: refund.idReembolso.toString(),
                param_user: Session.get().email,
                param_reeMes: currentDate.month.id.toString()
            };
            var url = $rootScope.Path + 'public/reporte/listadoDetalladoPDF?param_cch=' + data.param_cch + '&param_ree=' + data.param_ree + '&param_user=' + data.param_user + '&param_reeMes=' + data.param_reeMes;
            window.open(url, '_blank');
        }
    };

    $scope.Services = {
        loader: false,
        page: 1,
        constructor: function () {
            this.getData();
            this.getCashDetail();
            this.getByUser();
        },
        getData: function () {
            var self = this;
            if (self.loader == false) {
                self.loader = true;
                var filter = null;
                if ($scope.Search.type) {
                    switch ($scope.Search.type) {
                        case '0':
                            filter = $scope.Search.dependence;
                            break;
                        case '1':
                            filter = $scope.Search.attendant;
                            break;
                        case '2':
                            filter = $scope.Search.responsable;
                            break;
                        case '3':
                            filter = $scope.Search.register;
                            break;
                    }
                }
                var data = {
                    anio: currentDate.year,
                    mes: currentDate.month.id,
                    idPerfil: Session.get().idProfile,
                    paginacion: this.page,
                    opcion: $scope.Search.type,
                    filtro: filter
                };
                Refund.getRefundsValidate(data).then(function (res) {
                    res.data.reembolsos.forEach(function (refund) {
                        refund.fechaApertura = moment(refund.fechaApertura).format('DD/MM/YYYY');
                    });
                    $scope.Pagination.total = parseInt(res.data.paginaciones) * 10;
                    $scope.Pagination.current = 1;
                    $scope.Refunds = res.data.reembolsos;
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
                var filter = null;
                if ($scope.Search.type) {
                    switch ($scope.Search.type) {
                        case '0':
                            filter = $scope.Search.dependence;
                            break;
                        case '1':
                            filter = $scope.Search.attendant;
                            break;
                        case '2':
                            filter = $scope.Search.responsable;
                            break;
                        case '3':
                            filter = $scope.Search.register;
                            break;
                    }
                }
                var data = {
                    anio: currentDate.year,
                    mes: currentDate.month.id,
                    idPerfil: Session.get().idProfile,
                    paginacion: $scope.Pagination.current,
                    opcion: $scope.Search.type,
                    filtro: filter
                };
                Refund.getRefundsValidate(data).then(function (res) {
                    res.data.reembolsos.forEach(function (refund) {
                        refund.fechaApertura = moment(refund.fechaApertura).format('DD/MM/YYYY');
                    });
                    $scope.Refunds = res.data.reembolsos;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        },
        getByUser: function () {
            var self = this;
            var data = {
                idDependencia: Session.get().idDependence,
                dni: Session.get().dniUser,
                anio: new Date().getFullYear()
            };
            Cash.getByUser(data).then(function (response) {
                $scope.idCajaChica = response.data.idCajaChica;
                self.getCashDetail();
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        getCashDetail: function () {
            Refund.getDetail(parseFloat($scope.idCajaChica), currentDate.month.id, currentDate.year).then(function (response) {
                $scope.cajaChicaDetail = response.data;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        changeState: function (refund, state, index, list) {
            var data = {
                idReembolso: refund.idReembolso,
                idEstadoReembolso: state
            };
            Refund.changeStateRefundValidate(data).then(function (response) {
                console.log(response, 'response');
                if(state == 3) {
                    refund.estado = 'CP';
                }
                if(state == 5) {
                    list.splice(index, 1);
                }
            });
        }
    };

    $scope.$watch('DateGlobal', function (nw, old) {
        currentDate = nw;
        $scope.Services.constructor();
    });

});
