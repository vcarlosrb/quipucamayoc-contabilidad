angular.module('Accounting').controller('CreatespendingCtrl', function ($scope, $modal, Document, Tax, $stateParams, Spending, $state, Session) {

    $scope.maxDate = new Date();
    var vm = this;
    $scope.Documents = [];
    $scope.Form = {
        docContable: {},
        date: new Date()
    };
    var currentDate = {};
    $scope.Data = {
        docContable: {
            idProveedor: ''
        },
        docContDetalle: {},
        gasto: {},
        cajaChica: {},
        reembolso: {},
        impuesto: {}
    };
    $scope.Dependences = [];
    $scope.idCurrentDependence = null;
    $scope.Bill = false;
    $scope.ReceiptFree = false;
    $scope.Ticket = false;
    $scope.GroundTicket = false;
    $scope.SalesTicket = false;
    $scope.Taxes = [];
    $scope.Sorters = [];
    $scope.CurrentTaxes = [];

    vm.modalDocument = {
        show: function () {
            $modal.open({
                templateUrl: 'modals/Document/type/typeDocument.html',
                controller: 'TypedocumentCtrl',
                resolve: {
                    Data: function () {
                        return $scope.Documents;
                    }
                }
            }).result.then(function (result) {
                $scope.Bill = false;
                $scope.ReceiptFree = false;
                $scope.Ticket = false;
                $scope.SalesTicket = false;
                $scope.GroundTicket = false;
                $scope.Data.docContable.idTipoDocContable = result.idTipoDocContable;
                $scope.Form.docContable.idTipoDocContable = result.idTipoDocContable;
                $scope.Form.docContable.descTipoDocContable = result.descTipoDocContable;
                $scope.Taxes = [];
                if (result.idTipoDocContable == 20) {
                    $scope.Bill = true;
                    $scope.Services.getTaxes(result.idTipoDocContable);
                }
                if (result.idTipoDocContable == 21) {
                    $scope.Ticket = true;
                    $scope.Services.getTaxes(result.idTipoDocContable);
                }
                if (result.idTipoDocContable == 22) {
                    $scope.ReceiptFree = true;
                    $scope.Services.getTaxes(result.idTipoDocContable);
                }
                if (result.idTipoDocContable == 51) {
                    $scope.SalesTicket = true;
                    $scope.Services.getTaxes(result.idTipoDocContable);
                }
                if (result.idTipoDocContable == 52) {
                    $scope.GroundTicket = true;
                    $scope.Services.getTaxes(result.idTipoDocContable);
                }
            });
        }
    };

    vm.ModalDependence = {
        show: function () {
            $modal.open({
                templateUrl: 'modals/Dependence/list/listDependence.html',
                controller: 'ListDependenceCtrl'
            }).result.then(function (result) {
                result.sorters = [];
                result.total = 0;
                $scope.Dependences.push(result);
            });
        }
    };

    vm.ModalProvider = {
        show: function () {
            $modal.open({
                templateUrl: 'modals/Provider/list/listProvider.html',
                controller: 'ListProviderCtrl'
            }).result.then(function (result) {
                $scope.Data.docContable.idProveedor = result.ruc;
                $scope.Form.docContable.ruc = result.ruc;
                $scope.Form.docContable.nombre = result.razonSocial;
            });
        }
    };

    vm.ModalSorter = {
        show: function () {
            $modal.open({
                templateUrl: 'modals/Sorter/list/listSorter.html',
                controller: 'ListSorterCtrl'
            }).result.then(function (result) {
                $scope.Dependences.forEach(function (obj) {
                    if (obj.idDependencia == $scope.idCurrentDependence) {
                        result.base = 0;
                        result.impTotal = 0;
                        result.partial = 0;
                        result.total = 0;
                        result.taxes = angular.copy($scope.CurrentTaxes);
                        obj.sorters.push(result);
                    }
                });
            });
        }
    };

    $scope.Events = {
        deleteDependence: function (index) {
            swal({
                title: "Eliminar dependencia",
                text: '',
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
            }, function () {
                $scope.$apply(function () {
                    $scope.Dependences.splice(index, 1);
                });
                swal("¡Eliminado!", "Operacion realizada con exito.", "success");
            });
        },
        selectDependence: function (event, dependence) {
            $scope.idCurrentDependence = dependence.idDependencia;
            $scope.Sorters = dependence.sorters;
            $('.tableDependence tbody tr').css('background-color', 'white');
            $(event.currentTarget).parent().parent().parent().css('background-color', 'rgb(220,220,220)');
        },
        deleteSorter: function (index) {
            swal({
                title: "Eliminar clasificador",
                text: '',
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
            }, function () {
                $scope.Dependences.forEach(function (obj) {
                    if (obj.idDependencia == $scope.idCurrentDependence) {
                        $scope.$apply(function () {
                            obj.sorters.splice(index, 1);
                        });
                    }
                });
                swal("¡Eliminado!", "Operacion realizada con exito.", "success");
            });
        },
        calculateImp: function (value, sorter) {
            sorter.taxes.forEach(function (tax) {
                if (tax.idTipoImpuesto == 1) {
                    tax.impTotal = parseFloat(value * parseFloat(tax.porcentajeImp) * 10).toFixed(2);
                }
            });
            this.calculeTotal(sorter);
        },
        otherImp: function (sorter) {
            this.calculeTotal(sorter);
        },
        calculeTotal: function (sorter) {
            sorter.partial = angular.copy(sorter.base);
            sorter.total = angular.copy(sorter.base);
            sorter.taxes.forEach(function (tax) {
                sorter.partial = parseFloat(sorter.partial) + parseFloat(tax.impTotal);
                sorter.total = parseFloat(sorter.total) + parseFloat(tax.impTotal);
            });

            var sum = 0;
            var total = 0;
            $scope.Sorters.forEach(function (sor) {
                sum = parseFloat(sum) + parseFloat(sor.total);
            });
            $scope.Dependences.forEach(function (obj) {
                if (obj.idDependencia == $scope.idCurrentDependence) {
                    obj.total = sum;
                }
                total = parseFloat(total) + parseFloat(obj.total);
            });
        },
        toggleImp: function (tax, list) {
            var idx = list.indexOf(tax);
            if (idx > -1) list.splice(idx, 1);
            else list.push(tax);
            $scope.Dependences.forEach(function (dependence) {
                dependence.sorters.forEach(function (sorter) {
                    sorter.taxes = angular.copy($scope.CurrentTaxes);
                });
            });
        },
        existsImp: function (tax, list) {
            return list.indexOf(tax) > -1;
        }
    };

    $scope.Services = {
        constructor: function () {
            this.getDocuments();
        },
        getDocuments: function () {
            Document.list(Session.get().idProfile, 1).then(function (res) {
                $scope.Documents = res.data.tiposDoc;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        getTaxes: function (idDocCont) {
            Tax.list(idDocCont).then(function (res) {
                res.data.forEach(function (tax) {
                    tax.impTotal = 0;
                });
                $scope.Taxes = res.data;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        saveSpend: function () {
            var arrayDocContDetail = [];
            var totalNeto = 0;
            var totalBruto = 0;
            var totalImp = 0;
            $scope.Dependences.forEach(function (dep) {
                dep.sorters.forEach(function (sor) {
                    totalNeto = parseFloat(totalNeto) + parseFloat(sor.base);
                    totalBruto = parseFloat(totalBruto) + parseFloat(sor.total);
                    var tempImp = 0;
                    var taxes = [];
                    sor.taxes.forEach(function (tax) {
                        tempImp = parseFloat(tempImp) + parseFloat(tax.impTotal);
                        taxes.push({idImpuesto: tax.idTipoImpuesto, montoImpuesto: tax.impTotal});
                    });
                    totalImp = parseFloat(totalImp) + parseFloat(tempImp);
                    var obj = {
                        idDependencia: dep.idDependencia,
                        anio: parseInt(currentDate.year),
                        impuestos: taxes,
                        idGenerica: sor.codEspecifica,
                        anioGenerica: parseInt(currentDate.year),
                        montoBaseImponible: parseFloat(sor.base),
                        montoTotalImp: tempImp,
                        montoTotalBruto: sor.total
                    };
                    arrayDocContDetail.push(obj);
                });
            });

            var data = {
                "docContable": JSON.stringify({
                    idTipoDocContable: $scope.Form.docContable.idTipoDocContable,
                    idProveedor: $scope.Data.docContable.idProveedor,
                    serieDocContable: $scope.Data.docContable.serieDocContable,
                    numDocContable: $scope.Data.docContable.numDocContable,
                    fechaDocContable: moment($scope.Form.fechaDocContable).format('DD/MM/YYYY'),
                    notaDocContable: $scope.Data.docContable.notaDocContable,
                    montoTotalNeto: totalNeto,
                    montoTotalImp: totalImp,
                    montoTotalBruto: totalBruto,
                    glosaDocContable: $scope.Data.docContable.glosaDocContable
                }),
                "docContDetalle": JSON.stringify(arrayDocContDetail),
                "gasto": JSON.stringify({
                    idReembolso: parseFloat($stateParams.refund),
                    monto: totalBruto
                })
            };

            data.docContable = data.docContable.replace(/"/g, "'");
            data.docContDetalle = data.docContDetalle.replace(/"/g, "'");
            data.gasto = data.gasto.replace(/"/g, "'");

            Spending.create(data).then(function (response) {
                swal("¡Gasto creado!", "", "success");
                $scope.currentRefund.montoReembolso = parseFloat($scope.currentRefund.montoReembolso) + parseFloat(totalBruto);
                $state.go('app.private.init.refund.structure.expenses');
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });

        }
    };
    $scope.Services.constructor();

    $scope.$watch('DateGlobal', function (nw, old) {
        currentDate = nw;
    });

});
