angular.module('Accounting').controller('ListProviderCtrl',function($scope, Provider, $modalInstance){

    $scope.Providers = [];
    $scope.currentProvider = {};
    $scope.Search = {
        type: 0,
        ruc: '',
        businessName: ''
    };

    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 10,
        changePage: function () {
            $scope.Services.searchPagination($scope.Search);
        }
    };

    $scope.Events = {
        select: function (event, item) {
            $('.modProviderList .tableContent tbody tr').css('background-color', 'white');
            $(event.currentTarget).css('background-color', 'rgb(230,230,230)');
            $scope.currentProvider = item;
        },
        accept: function () {
            $modalInstance.close($scope.currentProvider);
        }
    };

    $scope.Services = {
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
