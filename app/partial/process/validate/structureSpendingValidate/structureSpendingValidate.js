angular.module('Accounting').controller('StructurespendingvalidateCtrl',function($scope){

    $scope.nroSpending = 0;
    $scope.EventSpending = {
        setSpending: function (nro) {
            $scope.nroSpending = nro;
        }
    }

});
