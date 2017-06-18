angular.module('Accounting').controller('DetailspendingvalidateCtrl',function($scope, Refund, $stateParams, Document, $modal, Spending, Tax, Session, $state){

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
    $scope.CurrentImp = null;

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
                            obj.calsificadores.splice(index, 1);
                        });
                    }
                });
                swal("¡Eliminado!", "Operacion realizada con exito.", "success");
            });
        },
        selectImp: function (id) {
            $scope.Taxes.forEach(function (obj) {
                if (obj.idTipoImpuesto == id) {
                    $scope.CurrentImp = obj;
                }
            });
        },
        calculateImp: function (value, sorter) {
            if ($scope.CurrentImp) {
                sorter.impTotal = parseFloat(value * parseFloat($scope.CurrentImp.porcentajeImp)*10);
            }

            if (sorter.impTotal == '' || sorter.impTotal == undefined || sorter.impTotal == 0) {
                sorter.partial = parseFloat(value);
                sorter.total = parseFloat(value);
            } else {
                sorter.partial = parseFloat(sorter.impTotal) + parseFloat(value);
                sorter.total = parseFloat(sorter.impTotal) + parseFloat(value);
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
        otherImp: function (value, sorter) {
            if (value == '' || value == undefined || value == 0) {
                sorter.partial = parseFloat(sorter.base);
                sorter.total = parseFloat(sorter.base);
            } else {
                sorter.partial = parseFloat(value) + parseFloat(sorter.base);
                sorter.total = parseFloat(value) + parseFloat(sorter.base);
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
                $scope.Data.docContable.idTipoDocContable =  res.data.idTipoDocContable;
                $scope.Form.docContable.idTipoDocContable = res.data.idTipoDocContable;
                $scope.Form.docContable.descTipoDocContable = res.data.descTipoDoc;
                $scope.Data.docContable.serieDocContable = res.data.serieDocContable;
                $scope.Data.docContable.numDocContable = res.data.numDocContable;
                $scope.Form.fechaDocContable = new Date(res.data.fechaDocContable);
                $scope.Form.docContable.ruc = res.data.idProveedor;
                $scope.Form.docContable.nombre = res.data.razonSocialPro;
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
                $scope.Taxes = res.data;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        getDependencies: function(id){
            Spending.getDependencies(id).then(function (response) {
                response.data.forEach(function (dependence) {
                    dependence.sorters = [];
                    dependence.calsificadores.forEach(function (sorter) {
                        if(sorter.idImpuesto) {
                            $scope.CurrentImp = {
                                abrevImpuesto: sorter.nombImpuesto,
                                porcentajeImp: sorter.porcentajeImp,
                                idImpuesto: sorter.idImpuesto
                            }
                        }
                        var dt = {
                            cadclasificador: sorter.cadClasificador,
                            descespecifica: sorter.dscClasificador,
                            base: sorter.montoBaseImponible,
                            impTotal: sorter.montoTotalImp,
                            partial: sorter.montoBaseImponible,
                            total: sorter.montoTotalBruto
                        };
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
            if(self.loader == false) {
                self.loader = true;
                var arrayDocContDetail = [];
                var totalNeto = 0;
                var totalBruto = 0;
                var totalImp = 0;
                $scope.Dependencies.forEach(function (dep) {
                    dep.sorters.forEach(function (sor) {
                        totalImp = parseFloat(totalImp) + parseFloat(sor.impTotal);
                        totalNeto = parseFloat(totalNeto) + parseFloat(sor.base);
                        totalBruto = parseFloat(totalBruto) + parseFloat(sor.total);
                        var obj = {
                            idDependencia: dep.idDependencia,
                            anio: parseInt(currentDate.year),
                            idImpuesto: 0,
                            idGenerica: sor.codEspecifica,
                            anioGenerica: parseInt(currentDate.year),
                            montoBaseImponible: parseFloat(sor.base),
                            montoTotalImp: sor.impTotal,
                            montoTotalBruto: sor.total
                        };
                        if($scope.CurrentImp){
                            obj.idImpuesto = $scope.CurrentImp.idTipoImpuesto;
                        }
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
                        montoTotalBruto: totalBruto
                    }),
                    "docContDetalle": JSON.stringify(arrayDocContDetail),
                    "gasto": JSON.stringify({
                        idReembolso: parseFloat($stateParams.refund),
                        numGasto: $scope.nroSpending,
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
