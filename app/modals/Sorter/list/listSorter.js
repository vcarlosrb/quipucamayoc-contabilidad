angular.module('Accounting').controller('ListSorterCtrl',function($scope, Sorter, $modalInstance){

    $scope.Sorters = [];
    $scope.currentSorter = null;
    $scope.inputSorter = null;
    $scope.Valid = {
        code: false
    };
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 5,
        changePage: function () {
            $scope.Services.searchPagination();
        }
    };

    $scope.Events = {
        select: function (event, sorter) {
            $scope.currentSorter = sorter;
            $scope.inputSorter = sorter.cadclasificador + ' - ' +sorter.descespecifica;
            $('.modSorter .tableContent tbody tr').css('background-color', 'white');
            $(event.currentTarget).css('background-color', 'rgb(230,230,230)');
        },
        accept: function () {
            if($scope.currentSorter == undefined) {
                $scope.Valid.code = true;
            } else {
                $scope.Valid.code = false;
                $modalInstance.close($scope.currentSorter);
            }
        }
    };

    $scope.Services = {
        page: 1,
        loader: false,
        constructor: function () {
            this.getData();
        },
        getData: function () {
            var self = this;
            if(self.loader == false) {
                self.loader = true;
                Sorter.list(this.page).then(function (response) {
                    $scope.Sorters = response.data.clasificador;
                    $scope.Pagination.total = parseInt(response.data.paginaciones)*10;
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
            if(self.loader == false) {
                self.loader = true;
                Sorter.list($scope.Pagination.current).then(function (response) {
                    $scope.Sorters = response.data.clasificador;
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
