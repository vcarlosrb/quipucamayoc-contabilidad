angular.module('Accounting').controller('OpeningcashdetailCtrl', function ($scope, $stateParams, Cash, $modal, $state, Session, $rootScope) {

    var currentDate = {};
    $scope.OriginData = {};
    $scope.idCajaChica = null;
    $scope.profileId = Session.get().idProfile;
    $scope.Form = {};
    $scope.Valid = {
        anioApertura: false,
        codCajaChica: false,
        anioRegistro: false,
        idRegContable: false,
        codDependencia: false,
        descDependencia: false,
        nombreResponsable: false,
        nombreEncargado: false,
        montoMensual: false,
        montoMaxDoc: false,
        idNumMeta: false,
        emailUser: false,
        numMontos: false,
        dniEncargado: false,
        nombreCompleto: false
    };

    $scope.Events = {
        modalDependence: function () {
            $modal.open({
                templateUrl: 'modals/Dependence/list/listDependence.html',
                controller: 'ListDependenceCtrl'
            }).result.then(function (result) {
                $scope.Form.idDependencia = result.idDependencia;
                $scope.Form.codDependencia = result.codDependencia;
                $scope.Form.descDependencia = result.descDependencia;
            });
        },
        modalUsers: function () {
            $modal.open({
                templateUrl: 'modals/User/list/listUser.html',
                controller: 'ListUserCtrl',
                windowClass: 'app-modal-user'
            }).result.then(function (result) {
                $scope.Form.nombreCompleto = result.nombreCompleto;
                $scope.Form.emailUser = result.email;
                $scope.Form.dniEncargado = result.dniUsuario;
            });
        },
        modalRefund: function () {
            $modal.open({
                templateUrl: 'modals/Refund/list/listRefund.html',
                controller: 'ListRefundCtrl',
                windowClass: 'app-modal-refund',
                resolve: {
                    CurrentDate: function () {
                        return currentDate;
                    },
                    DataCash: function () {
                        return $scope.OriginData;
                    },
                    CashId: function () {
                        return $scope.idCajaChica;
                    }
                }
            }).result.then(function (result) {
                swal("¡Reembolsos por mes actualizados!", "", "success");
            });
        },
        reportRefund: function () {
            $modal.open({
                templateUrl: 'modals/Refund/report/reportRefund.html',
                controller: 'ReportRefundCtrl',
                resolve: {
                    CashId: function () {
                        return $scope.OriginData.idCajaChica;
                    },
                    CurrentDate: function () {
                        return currentDate;
                    }
                }
            }).result.then(function (result) {
                swal("¡Reporte generado!", "", "success");
            });
        }
    };

    $scope.Services = {
        data: {},
        constructor: function () {
            this.getData();
            this.getByUser();
        },
        getData: function () {
            Cash.signupOpenedDetail($stateParams.id).then(function (response) {
                $scope.OriginData = response.data;
                $scope.Form = angular.copy(response.data);
                $scope.Form.idNumMeta = response.data.numMeta;
                $scope.Form.emailUser = response.data.email;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        getByUser: function () {
            var data = {
                idDependencia: Session.get().idDependence,
                dni: Session.get().dniUser,
                anio: new Date().getFullYear()
            };
            Cash.getByUser(data).then(function (response) {
                $scope.idCajaChica = response.data.idCajaChica;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        },
        update: function (form) {
            if ($scope.Validate.update(form)) {
                var data = {
                    "anioApertura": form.anioApertura,
                    "codCajaChica": form.codCajaChica,
                    "idDependencia": form.idDependencia,
                    "numMontos": form.numMontos,
                    "montoMensual": form.montoMensual,
                    "montoMaxDoc": form.montoMaxDoc,
                    "nombreResponsable": form.nombreResponsable.toUpperCase(),
                    "nombreEncargado": form.nombreEncargado,
                    "estadoCajaChica": form.estadoCajaChica,
                    "dniEncargado": form.dniEncargado,
                    "idNumMeta": form.idNumMeta,
                    "idRegContable": form.idRegContable,
                    "idCajaChica": $scope.OriginData.idCajaChica
                };

                Cash.updateOpened(data).then(function (response) {
                    swal("¡Caja chica actualizada!", "", "success");
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                });
            }
        }
    };
    $scope.Services.constructor();

    $scope.Validate = {
        update: function (data) {
            $scope.Valid.anioApertura = (data.anioApertura == undefined || data.anioApertura == '');
            $scope.Valid.codCajaChica = (data.codCajaChica == undefined || data.codCajaChica == '');
            $scope.Valid.anioRegistro = (data.anioRegistro == undefined || data.anioRegistro == '');
            $scope.Valid.idRegContable = (data.idRegContable == undefined || data.idRegContable == '');
            $scope.Valid.codDependencia = (data.codDependencia == undefined || data.codDependencia == '');
            $scope.Valid.descDependencia = (data.descDependencia == undefined || data.descDependencia == '');
            $scope.Valid.nombreResponsable = (data.nombreResponsable == undefined || data.nombreResponsable == '');
            $scope.Valid.nombreEncargado = (data.nombreEncargado == undefined || data.nombreEncargado == '');
            $scope.Valid.montoMensual = (data.montoMensual == undefined || data.montoMensual == '');
            //$scope.Valid.montoMaxDoc = (data.montoMaxDoc == undefined || data.montoMaxDoc == '');
            $scope.Valid.idNumMeta = (data.idNumMeta == undefined || data.idNumMeta == '');
            $scope.Valid.emailUser = (data.emailUser == undefined || data.emailUser == '');
            //$scope.Valid.numMontos = (data.numMontos == undefined || data.numMontos == '');
            $scope.Valid.dniEncargado = (data.dniEncargado == undefined || data.dniEncargado == '');
            $scope.Valid.nombreCompleto = (data.nombreCompleto == undefined || data.nombreCompleto == '');

            return (!$scope.Valid.anioApertura && !$scope.Valid.codCajaChica && !$scope.Valid.anioRegistro && !$scope.Valid.idRegContable && !$scope.Valid.codDependencia && !$scope.Valid.descDependencia && !$scope.Valid.nombreResponsable && !$scope.Valid.nombreEncargado && !$scope.Valid.montoMensual && !$scope.Valid.montoMaxDoc && !$scope.Valid.idNumMeta && !$scope.Valid.emailUser && !$scope.Valid.numMontos && !$scope.Valid.dniEncargado && !$scope.Valid.nombreCompleto)
        }
    };

    $scope.$watch('DateGlobal', function (nw, old) {
        currentDate = nw;
        $scope.Services.constructor();
    });

});
