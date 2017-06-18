angular.module('Accounting').controller('ReportRefundCtrl', function ($scope, CashId, Session, CurrentDate, $rootScope, $modalInstance) {

    $scope.Form = {};

    $scope.Services = {
        report: function (form) {
            var data = {
                param_cch: CashId,
                param_user: Session.get().email,
                param_mes1: moment(form.starDate).format('DD-MM-YYYY'),
                param_mes2: moment(form.endDate).format('DD-MM-YYYY'),
                param_dep: Session.get().idDependence,
                param_anio: CurrentDate.year
            };
            var url = $rootScope.Path + 'public/reporte/listadoReembolsosPDF?param_cch=' + data.param_cch + '&param_user=' + data.param_user + '&param_mes1=' + data.param_mes1 + '&param_mes2=' + data.param_mes2 + '&param_dep=' + data.param_dep + '&param_anio=' + data.param_anio;
            window.open(url, '_blank');
            $modalInstance.close();
        }
    }

});
