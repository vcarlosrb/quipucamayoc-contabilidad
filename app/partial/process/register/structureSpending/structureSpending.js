angular.module('Accounting').controller('StructurespendingCtrl',function($scope){

    $scope.nroSpending = 0;
    $scope.currentSpending = null;
    $scope.EventSpending = {
        setSpending: function (nro) {
            $scope.nroSpending = nro;
        },
        selectSpending: function (spending) {
            $scope.currentSpending = spending;
        }
    }

});
