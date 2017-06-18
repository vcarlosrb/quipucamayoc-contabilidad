angular.module('Accounting').controller('CreateFlyingCtrl',function($scope, DateService, Session, CashId, Document, $modal){

    $scope.Months = DateService.getMonths();
    $scope.Documents = [];

    $scope.Events = {
        modalDocument: function () {
            $modal.open({
                templateUrl: 'modals/Document/type/typeDocument.html',
                controller: 'TypedocumentCtrl',
                resolve: {
                    Data: function () {
                        return $scope.Documents;
                    }
                }
            }).result.then(function (result) {
                console.log(result, 'document');
                $scope.Form.tipoDocumento = result.tipoDocumento
            });
        }
    };

    $scope.Services = {
        constructor: function () {
            this.getDocuments();
        },
        create: function (form) {
            var data = {
                "mes": form.month,
                "tipoVuelta": "V",
                "idCajaChica": CashId,
                "idDependencia": Session.get().idDependence,
                "tipoDocumento": form.tipoDocumento,
                "numDocumento": form.numDocumento,
                "montoVuelta": form.montoVuelta,
                "estadoVuelta": "1",
                "dniUsuCreador": Session.get().dniUser
            }
        },
        getDocuments: function () {
            Document.list(Session.get().idProfile, 1).then(function (res) {
                $scope.Documents = res.data.tiposDoc;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
        }
    };
    $scope.Services.constructor();

});
