angular.module('Accounting').controller('ListStudentCtrl', function ($scope, Student, $modalInstance, $mdToast) {

    $scope.Search = {
        filter: ''
    };
    $scope.Valid = {
        code: false
    };
    $scope.Students = [];
    $scope.currentStudent = null;
    //El paginador divide el total de items entre 10 para el total de paginas
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 5,
        changePage: function () {
            $scope.Services.searchPagination($scope.Search);
        }
    };

    $scope.Events = {
        selectStudent: function (event, student) {
            $('.modStudent .tableContent tbody tr').css('background-color', 'white');
            $(event.currentTarget).css('background-color', 'rgb(230,230,230)');
            $scope.currentStudent = student;
        },
        accept: function () {
            if($scope.currentStudent == undefined) {
                $scope.Valid.code = true;
            } else {
                $scope.Valid.code = false;
                $modalInstance.close($scope.currentStudent);
            }
        }
    };

    $scope.Services = {
        page: 1,
        loader: false,
        search: function (form) {
            var self = this;
            if(self.loader == false) {
                self.loader = true;
                Student.search(form.filter, this.page).then(function (response) {
                    $scope.Students = response.data.alumnos;
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
                Student.search(form.filter, $scope.Pagination.current).then(function (response) {
                    $scope.Students = response.data.alumnos;
                    self.loader = false;
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                    self.loader = false;
                });
            }
        }
    }

});
