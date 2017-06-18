angular.module('Accounting').controller('ProviderCtrl', function ($scope, $modal, $state, Provider) {

    var vm = this;

    $scope.Providers = [];
    $scope.Search = {
        type: 0,
        ruc: '',
        businessName: ''
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

    vm.ModalProvider = {
        create: function () {
            $modal.open({
                templateUrl: 'modals/Provider/create/createProvider.html',
                controller: 'CreateProviderCtrl'
            }).result.then(function (result) {

            });

        }
    };

    vm.Events = {
        goDetailProvider: function (provider) {
            if(provider.tipoProveedor == 'P') {
                $state.go('app.private.init.detailProvider', {ruc: provider.ruc});
            } else {
                $state.go('app.private.init.detailExternal', {ruc: provider.ruc});
            }
        }
    };

    vm.Services = {
        loader: false,
        page: 1,
        init: function () {

        },
        search: function (form) {
            var self = this;
            if (self.loader == false) {
                self.loader = true;
                var filter = null;
                if (form.type == 0) {
                    filter = form.ruc;
                } else {
                    filter = form.businessName
                }
                Provider.search(filter, form.type, this.page).then(function (response) {
                    $scope.Providers = response.data.proveedores;
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
            if (self.loader == false) {
                self.loader = true;
                var filter = null;
                if (form.type == 0) {
                    filter = form.ruc;
                } else {
                    filter = form.businessName
                }
                Provider.search(filter, form.type, $scope.Pagination.current).then(function (response) {
                    $scope.Providers = response.data.proveedores;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        }
    };

});
