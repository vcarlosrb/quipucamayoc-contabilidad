angular.module('Accounting').controller('AccountingspendingCtrl', function ($scope, $modal, Refund, $stateParams, Session, $state) {

    var vm = this;
    $scope.Expenses = [];
    $scope.Form = {};
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

    vm.Modal = {
        project: function () {
            $modal.open({
                templateUrl: 'modals/Project/list/listProjects.html',
                controller: 'ListProjectsCtrl'
            }).result.then(function (result) {
                $scope.Form.codProyConvenio = result.codProyConvenio;
                $scope.Form.descProyConvenio = result.descProyConvenio;
            });
        },
        area: function () {
            $modal.open({
                templateUrl: 'modals/Area/list/listArea.html',
                controller: 'ListAreaCtrl'
            }).result.then(function (result) {
                $scope.Form.codArea = result.codArea;
                $scope.Form.descArea = result.descArea;
            });
        }
    };

    $scope.Services = {
        loader: false,
        constructor: function () {
            this.getExpenses();
            this.getSummary();
        },
        getExpenses: function () {
            var self = this;
            if (self.loader == false) {
                self.loader = true;
                Refund.getExpensesByRefund({idReembolso: $stateParams.refund}).then(function (response) {
                    $scope.Expenses = response.data.gastos;
                    $scope.Pagination.total = parseInt(response.data.paginaciones) * 10;
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
                Refund.getExpensesByRefund({
                    idReembolso: $stateParams.refund,
                    paginacion: $scope.Pagination.current
                }).then(function (response) {
                    $scope.Expenses = response.data.gastos;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        },
        getSummary: function () {
            if ($scope.currentRefund) {
                var data = {
                    numReembolso: $scope.currentRefund.numReembolso,
                    montoReembolso: $scope.currentRefund.montoReembolso,
                    idPerfil: Session.get().idProfile,
                    idCajaChica: $scope.idCajaChica,
                    mes: currentDate.month.id,
                    anio: currentDate.year
                };
                Refund.summary(data).then(function (response) {
                    console.log(response.data, 'response.data')
                    $scope.Form = response.data;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                });
            }
        },
        generateAccountingRecord: function (form) {
            if (form.codArea != '' && form.codArea != undefined) {
                var data = {
                    "idReembolso": $stateParams.refund,
                    "numReembolso": form.numReembolso,
                    "notaRegistro": form.notaRegistro || '',
                    "glosa": form.glosa,
                    "tipo": $scope.currentRefund.tipoReembolso,
                    "idDependencia": Session.get().idDependence,
                    "idCajaChica": $scope.idCajaChica,
                    "idUsuario": Session.get().dniUser,
                    "idRegContable": $scope.currentRefund.idRegContable,
                    "idProyConvenio": form.codProyConvenio,
                    "codArea": form.codArea
                };
                Refund.generateAccountingRecord(data).then(function (response) {
                    swal("¡Registro contable generado!", "", "success");
                    $state.go('app.private.init.refund.init');
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                });
            }
        }
    };

    $scope.$watch('DateGlobal', function (nw, old) {
        currentDate = nw;
        $scope.Services.constructor();
    });

});
