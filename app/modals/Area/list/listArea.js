angular.module('Accounting').controller('ListAreaCtrl',function($scope, Area, $modalInstance){

    $scope.Areas = [];
    $scope.currentArea = null;
    //El paginador divide el total de items entre 10 para el total de paginas
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 10,
        changePage: function () {
            $scope.Services.searchPagination();
        }
    };

    $scope.Events = {
        selectProject: function (event, area) {
            $('.modTypeDocument .tableContent tbody tr').css('background-color', 'white');
            $(event.currentTarget).css('background-color', 'rgb(230,230,230)');
            $scope.currentArea = area;
        },
        accept: function () {
            $modalInstance.close($scope.currentArea);
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
                Area.list(this.page).then(function (response) {
                    console.log(response, 'area')
                    $scope.Areas = response.data.areas;
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
            if (self.loader == false) {
                self.loader = true;
                Area.list($scope.Pagination.current).then(function (response) {
                    $scope.Areas = response.data.areas;
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
