angular.module('Accounting').controller('DetailspendingCtrl', function ($scope, Refund, $stateParams, Document, $modal, Spending, Tax, Session, $state) {

    $scope.selectRefund = $scope.currentRefund;

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
    $scope.Dependencies = [];
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
                $scope.Dependencies.push(result);
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
                $scope.Dependencies.forEach(function (obj) {
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
        selectDependence: function (event, dependence) {
            $scope.idCurrentDependence = dependence.idDependencia;
            $scope.Sorters = dependence.sorters;
            $('.tableDependence tbody tr').css('background-color', 'white');
            $(event.currentTarget).parent().parent().parent().css('background-color', 'rgb(220,220,220)');
        },
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
                    $scope.Dependencies.splice(index, 1);
                });
                swal("¡Eliminado!", "Operacion realizada con exito.", "success");
            });
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
                $scope.Dependencies.forEach(function (obj) {
                    if (obj.idDependencia == $scope.idCurrentDependence) {
                        $scope.$apply(function () {
                            obj.sorters.splice(index, 1);
                            obj.total = 0;
                            obj.sorters.forEach(function (item) {
                                obj.total = parseFloat(obj.total) + parseFloat(item.total);
                            });
                        });
                    }
                });
                swal("¡Eliminado!", "Operacion realizada con exito.", "success");
            });
        },
        calculateImp: function (value, sorter) {
            if(sorter.taxes) {
                sorter.taxes.forEach(function (tax) {
                    if (tax.idTipoImpuesto == 1) {
                        tax.impTotal = parseFloat(value * parseFloat(tax.porcentajeImp) * 10).toFixed(2);
                    }
                });
            }
            this.calculeTotal(sorter);
        },
        otherImp: function (sorter) {
            this.calculeTotal(sorter);
        },
        calculeTotal: function (sorter) {
            sorter.partial = angular.copy(sorter.base);
            sorter.total = angular.copy(sorter.base);
            if(sorter.taxes) {
                sorter.taxes.forEach(function (tax) {
                    sorter.partial = parseFloat(sorter.partial) + parseFloat(tax.impTotal);
                    sorter.total = parseFloat(sorter.total) + parseFloat(tax.impTotal);
                });
            }

            var sum = 0;
            var total = 0;
            $scope.Sorters.forEach(function (sor) {
                sum = parseFloat(sum) + parseFloat(sor.total);
            });
            $scope.Dependencies.forEach(function (obj) {
                if (obj.idDependencia == $scope.idCurrentDependence) {
                    obj.total = sum;
                }
                total = parseFloat(total) + parseFloat(obj.total);
            });
        },
        toggleImp: function (tax, list) {
            tax.ck = !tax.ck;
            var flag = false;
            list.forEach(function (item, i ,a) {
                if(item.idTipoImpuesto == tax.idTipoImpuesto) {
                    a.splice(i, 1);
                    flag = true;
                }
            });
            if(flag == false) {
                tax.impTotal = 0;
                list.push(tax);
            }
            $scope.Dependencies.forEach(function (dependence) {
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
        loader: false,
        constructor: function () {
            this.getData();
            this.getDocuments();
        },
        getData: function () {
            var self = this;
            Refund.getDetailBySpending($stateParams.spending).then(function (res) {
                if (res.data.impuestos) {
                    res.data.impuestos.forEach(function (tax) {
                        var tx = {
                            abrevImpuesto: tax.nombImpuesto,
                            codTipoImpuesto: null,
                            desTipoImpuesto: null,
                            idTipoImpuesto: tax.idImpuesto,
                            porcentajeImp: tax.porcentajeImp,
                            tipoImpAplicado: null
                        };
                        $scope.CurrentTaxes.push(tx);
                    });
                }
                if (res.data.idTipoDocContable == 20) {
                    $scope.Bill = true;
                    $scope.Services.getTaxes(res.data.idTipoDocContable);
                }
                if (res.data.idTipoDocContable == 21) {
                    $scope.Ticket = true;
                    $scope.Services.getTaxes(res.data.idTipoDocContable);
                }
                if (res.data.idTipoDocContable == 22) {
                    $scope.ReceiptFree = true;
                    $scope.Services.getTaxes(res.data.idTipoDocContable);
                }
                if (res.data.idTipoDocContable == 51) {
                    $scope.SalesTicket = true;
                    $scope.Services.getTaxes(res.data.idTipoDocContable);
                }
                if (res.data.idTipoDocContable == 52) {
                    $scope.GroundTicket = true;
                    $scope.Services.getTaxes(res.data.idTipoDocContable);
                }

                $scope.Data.docContable.idProveedor = res.data.idProveedor;
                $scope.Form.docContable.idDocContable = res.data.idDocContable;
                $scope.Data.docContable.idTipoDocContable = res.data.idTipoDocContable;
                $scope.Form.docContable.idTipoDocContable = res.data.idTipoDocContable;
                $scope.Form.docContable.descTipoDocContable = res.data.descTipoDoc;
                $scope.Data.docContable.serieDocContable = res.data.serieDocContable;
                $scope.Data.docContable.numDocContable = res.data.numDocContable;
                $scope.Form.fechaDocContable = new Date(res.data.fechaDocContable);
                $scope.Form.docContable.ruc = res.data.idProveedor;
                $scope.Form.docContable.nombre = res.data.razonSocialPro;
                $scope.Form.docContable.glosaDocContable = res.data.glosaDocContable;
                $scope.Data.docContable.notaDocContable = res.data.notaDocContable;
                self.getDependencies(res.data.idDocContable);
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
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
                    tax.ck = false;
                    $scope.CurrentTaxes.forEach(function (cr) {
                        if (cr.idTipoImpuesto == tax.idTipoImpuesto) {
                            tax.ck = true;
                        }
                    });
                });
                $scope.Taxes = res.data;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        getDependencies: function (id) {
            Spending.getDependencies(id).then(function (response) {
                response.data.forEach(function (dependence) {
                    dependence.sorters = [];
                    dependence.calsificadores.forEach(function (sorter) {
                        var dt = {
                            cadclasificador: sorter.cadClasificador,
                            descespecifica: sorter.dscClasificador,
                            base: sorter.montoBaseImponible,
                            impTotal: sorter.montoTotalImp,
                            partial: sorter.montoBaseImponible,
                            total: sorter.montoTotalBruto,
                            taxes: sorter.impuestos,
                            idDocContDetalle: sorter.idDocContDetalle,
                            idGenerica: sorter.idGenerica
                        };
                        $scope.CurrentTaxes = [];
                        dt.taxes.forEach(function (tax) {
                            var cim = {
                                idTipoImpuesto: tax.idImpuesto,
                                impTotal: 0,
                                abrevImpuesto: tax.nombImpuesto,
                                porcentajeImp: tax.porcentajeImp
                            };
                            tax.idTipoImpuesto = tax.idImpuesto;
                            $scope.CurrentTaxes.push(cim);
                            tax.impTotal = tax.montoImpuesto;
                        });
                        dependence.sorters.push(dt);
                    });
                    var data = {
                        codDependencia: dependence.codDependencia,
                        descDependencia: dependence.dscDependencia,
                        total: dependence.montoTotalBruto,
                        idDependencia: dependence.idDependencia,
                        montoTotalImp: dependence.montoTotalImp,
                        montoBaseImponible: dependence.montoTotalNeto,
                        montoTotalBruto: dependence.montoTotalBruto,
                        sorters: dependence.sorters
                    };
                    $scope.Dependencies.push(data);
                });
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        update: function () {
            var self = this;
            if (self.loader == false) {
                self.loader = true;
                var arrayDocContDetail = [];
                var totalNeto = 0;
                var totalBruto = 0;
                var totalImp = 0;
                $scope.Dependencies.forEach(function (dep) {
                    dep.sorters.forEach(function (sor) {
                        totalNeto = parseFloat(totalNeto) + parseFloat(sor.base);
                        totalBruto = parseFloat(totalBruto) + parseFloat(sor.total);
                        var tempImp = 0;
                        var taxes = [];
                        if(sor.taxes) {
                            sor.taxes.forEach(function (tax) {
                                tempImp = parseFloat(tempImp) + parseFloat(tax.impTotal);
                                var send = {
                                    idImpuesto: tax.idTipoImpuesto,
                                    montoImpuesto: tax.impTotal
                                };
                                if (tax.idDocContableImp) {
                                    send.idDocContableImp = tax.idDocContableImp;
                                }
                                taxes.push(send);
                            });
                        }
                        totalImp = parseFloat(totalImp) + parseFloat(tempImp);
                        var obj = {
                            idDependencia: dep.idDependencia,
                            anio: parseInt(currentDate.year),
                            impuestos: taxes,
                            idGenerica: sor.idGenerica || sor.codEspecifica,
                            anioGenerica: parseInt(currentDate.year),
                            montoBaseImponible: parseFloat(sor.base),
                            montoTotalImp: tempImp,
                            montoTotalBruto: parseFloat(sor.total),
                            idDocContDetalle: sor.idDocContDetalle
                        };
                        arrayDocContDetail.push(obj);
                    });
                });

                var data = {
                    "docContable": JSON.stringify({
                        idDocContable: $scope.Form.docContable.idDocContable,
                        idTipoDocContable: $scope.Form.docContable.idTipoDocContable,
                        idProveedor: $scope.Data.docContable.idProveedor,
                        serieDocContable: $scope.Data.docContable.serieDocContable,
                        numDocContable: $scope.Data.docContable.numDocContable,
                        fechaDocContable: moment($scope.Form.fechaDocContable).format('DD/MM/YYYY'),
                        notaDocContable: $scope.Data.docContable.notaDocContable,
                        montoTotalNeto: totalNeto,
                        montoTotalImp: totalImp,
                        montoTotalBruto: totalBruto,
                        glosaDocContable: $scope.Form.docContable.glosaDocContable
                    }),
                    "docContDetalle": JSON.stringify(arrayDocContDetail),
                    "gasto": JSON.stringify({
                        idGasto: $scope.currentSpending.idGasto,
                        idReembolso: parseFloat($stateParams.refund),
                        monto: totalBruto
                    })
                };

                data.docContable = data.docContable.replace(/"/g, "'");
                data.docContDetalle = data.docContDetalle.replace(/"/g, "'");
                data.gasto = data.gasto.replace(/"/g, "'");

                Spending.update(data).then(function (response) {
                    swal("¡Gasto actualizado!", "", "success");
                    $state.go('app.private.init.refund.structure.expenses');
                    self.loader = false;
                }, function (err) {
                    self.loader = false;
                    swal("¡Error!", err.data.mensaje, "error");
                });
            }
        }
    };
    $scope.Services.constructor();

    $scope.$watch('DateGlobal', function (nw, old) {
        currentDate = nw;
    });

});
