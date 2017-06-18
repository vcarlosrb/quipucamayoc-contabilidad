angular.module('Accounting').controller('ListProjectsCtrl',function($scope, Project, $modalInstance){

    $scope.Projects = [];
    $scope.currentProject = null;
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
        selectProject: function (event, project) {
            $('.modTypeDocument .tableContent tbody tr').css('background-color', 'white');
            $(event.currentTarget).css('background-color', 'rgb(230,230,230)');
            $scope.currentProject = project;
        },
        accept: function () {
            $modalInstance.close($scope.currentProject);
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
                Project.list(this.page).then(function (response) {
                    $scope.Projects = response.data.proyectos;
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
                Project.list($scope.Pagination.current).then(function (response) {
                    $scope.Projects = response.data.proyectos;
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
