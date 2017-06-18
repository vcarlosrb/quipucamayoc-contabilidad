angular.module('Accounting').controller('ListUserCtrl',function($scope, Cash, $modalInstance){

    $scope.Valid = {
        code: false
    };
    $scope.Users = [];
    $scope.currentUser = null;
    //El paginador divide el total de items entre 10 para el total de paginas
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 5,
        changePage: function () {
            $scope.Services.searchPagination();
        }
    };

    $scope.Events = {
        selectStudent: function (event, user) {
            $('.modStudent .tableContent tbody tr').css('background-color', 'white');
            $(event.currentTarget).css('background-color', 'rgb(230,230,230)');
            $scope.currentUser = user;
        },
        accept: function () {
            if($scope.currentUser == undefined) {
                $scope.Valid.code = true;
            } else {
                $scope.Valid.code = false;
                $modalInstance.close($scope.currentUser);
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
                Cash.getUsers(this.page).then(function (response) {
                    $scope.Users = response.data.usuarios;
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
                Cash.getUsers($scope.Pagination.current).then(function (response) {
                    $scope.Users = response.data.usuarios;
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
