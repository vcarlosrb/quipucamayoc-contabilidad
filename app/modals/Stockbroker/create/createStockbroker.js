angular.module('Accounting').controller('CreateStockbrokerCtrl', function ($scope, $modal, $modalInstance, Stockbroker) {

    $scope.Form = {
        student: {},
        dependence: {}
    };
    $scope.Valid = {
        student: false,
        dependence: false
    };

    $scope.ModalStudent = {
        show: function () {
            $modal.open({
                templateUrl: 'modals/Student/list/listStudent.html',
                controller: 'ListStudentCtrl'
            }).result.then(function (result) {
                $scope.Form.student = result;
            });
        }
    };

    $scope.ModalDependence = {
        show: function () {
            $modal.open({
                templateUrl: 'modals/Dependence/list/listDependence.html',
                controller: 'ListDependenceCtrl'
            }).result.then(function (result) {
                $scope.Form.dependence = result;
            });
        }
    };

    $scope.Services = {
        loader: false,
        create: function (form) {
            var self = this;
            if (form.student.codAlumno && form.dependence.idDependencia && self.loader == false) {
                self.loader = true;
                $scope.Valid = {
                    student: false,
                    dependence: false
                };
                var data = {
                    codMatricula: form.student.codAlumno,
                    dniAlumno: form.student.dni,
                    nombreComp: form.student.nombreCompleto,
                    apellidoPat: form.student.apePaterno,
                    apellidoMat: form.student.apeMaterno,
                    nombre: form.student.nomAlumno,
                    idDependenciaPertenece: form.student.idDependenciaPertence,
                    idDependenciaLabora: form.dependence.idDependencia
                };
                Stockbroker.create(data).then(function (res) {
                    self.loader = false;
                    $modalInstance.close();
                }, function (err) {
                    self.loader = false;
                    swal("¡Error!", err.data.mensaje, "error");
                });
            } else {
                $scope.Valid.student = (form.student.codAlumno == undefined);
                $scope.Valid.dependence = (form.dependence.idDependencia == undefined);
            }
        }
    }


});
