angular.module('Accounting').controller('StockbrokerCtrl', function ($scope, $modal, Stockbroker) {

    var vm = this;
    $scope.Stockbrokers = [];
    $scope.Search = {
        type: 0,
        code: '',
        name: ''
    };
    //El paginador divide el total de items entre 10 para el total de paginas
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 10,
        changePage: function () {
            vm.Services.searchPagination($scope.Search);
        }
    };

    vm.ModalStockbroker = {
        create: function () {
            $modal.open({
                templateUrl: 'modals/Stockbroker/create/createStockbroker.html',
                controller: 'CreateStockbrokerCtrl'
            }).result.then(function (result) {
                swal("¡Bolsista creado!", "", "success");
            });
        },
        detail: function (stockbroker) {
            $modal.open({
                templateUrl: 'modals/Stockbroker/detail/detailStockbroker.html',
                controller: 'DetailStockbrokerCtrl',
                resolve: {
                    Data: function () {
                        return stockbroker;
                    }
                }
            }).result.then(function (result) {
                //do something with the result
            });
        },
        edit: function (stockbroker) {
            $modal.open({
                templateUrl: 'modals/Stockbroker/edit/editStockbroker.html',
                controller: 'EditStockbrokerCtrl',
                resolve: {
                    Data: function () {
                        return stockbroker;
                    }
                }
            }).result.then(function (result) {
                if(result) {
                    stockbroker.descDependenciaLabora = result.descDependencia;
                    stockbroker.codDependenciaLabora = result.codDependencia;
                    swal("¡Bolsista actualizado!", "", "success");
                }
            });
        }
    };

    vm.Events = {
        deleteStockbroker: function (stockbroker, index) {
            swal({
                title: "Eliminar Bolsista",
                text: stockbroker.codMatricula+" - "+stockbroker.nombreComp,
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
            }, function () {
                vm.Services.deleteStockbroker(stockbroker.codMatricula, index);
            });
        }
    };

    vm.Services = {
        loader: false,
        page: 1,
        search: function (form) {
            var self = this;
            if(self.loader == false) {
                self.loader = true;
                var filter = null;
                if(form.type == 0) {
                    filter = form.code;
                } else {
                    if(form.type == 1) {
                        filter = form.name
                    }
                }
                Stockbroker.search(filter, form.type, this.page).then(function (response) {
                    $scope.Stockbrokers = response.data.bolsistas;
                    $scope.Pagination.total = parseInt(response.data.paginaciones)*10;
                    $scope.Pagination.current = 1;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        },
        searchPagination: function (form) {
            var self = this;
            if(self.loader == false) {
                self.loader = true;
                var filter = null;
                if(form.type == 0) {
                    filter = form.code;
                } else {
                    if(form.type == 1) {
                        filter = form.name
                    }
                }
                Stockbroker.search(filter, form.type, $scope.Pagination.current).then(function (response) {
                    $scope.Stockbrokers = response.data.bolsistas;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        },
        deleteStockbroker: function (id, index) {
            Stockbroker.delete(id).then(function (response) {
                $scope.Stockbrokers.splice(index,1);
                swal("¡Eliminado!", "Operacion realizada con exito.", "success");
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        }
    };

});
