angular.module('Accounting').controller('ListDependenceCtrl', function ($scope, Dependence, $modalInstance, Session) {

    $scope.Valid = {
        dependence: false
    };
    $scope.DependenceParent = {
        codDependencia: Session.get().codDependence,
        descDependencia: Session.get().descDependence,
        idDependencia: Session.get().idDependence
    };
    $scope.firstSub = [];
    $scope.SecondSub = [];
    $scope.previewDependence = null;
    $scope.currentDependence = null;
    $scope.Events = {
        toggleSlide: function (event, nro, dependence) {
            var block = $(event.currentTarget).parent().parent();
            if (nro == 1) {
                block.find('.firstSub').stop().slideToggle(200);
            } else {
                block.find('.secondSub').stop().slideToggle(200);
            }
            $scope.Services.getSubDependencies(dependence, nro, block);
        },
        selectDependence: function (dependence, event) {
            $('.tbtCheck').removeClass('active');
            $(event.currentTarget).addClass('active');
            $scope.currentDependence = dependence;
            $scope.previewDependence = dependence.codDependencia + ' - ' + dependence.descDependencia;
        },
        accept: function () {
            if ($scope.currentDependence) {
                $modalInstance.close($scope.currentDependence);
                $scope.Valid.dependence = false;
            } else {
                $scope.Valid.dependence = true;
            }
        }
    };

    $scope.Services = {
        loader: false,
        init: function () {
            this.getDependencies();
        },
        getDependencies: function () {
            var self = this;
            self.loader = true;
            Dependence.list(Session.get().idProfile, Session.get().idDependence).then(function (response) {
                $scope.Dependencies = response.data;
                self.loader = false;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
                self.loader = false;
            });
        },
        getSubDependencies: function (dependence, nro, block) {
            Dependence.list(Session.get().idProfile, dependence.idDependencia).then(function (response) {
                if (nro == 1) {
                    dependence.sub = response.data;
                } else {
                    dependence.sub = response.data;
                }
                $('.cl1').css('display', 'none');
                $('.cl2').css('display', 'none');
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
            });
            if (nro == 1) {
                block.find('.cl1').css('display', 'block');
            } else {
                block.find('.cl2').css('display', 'block');
            }
        }
    };
    $scope.Services.init();

});
