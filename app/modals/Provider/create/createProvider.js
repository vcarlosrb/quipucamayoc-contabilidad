angular.module('Accounting').controller('CreateProviderCtrl',function($scope, $state, $modalInstance){

    $scope.Events = {
        goCreateProvider: function () {
            $state.go('app.private.init.createProvider');
            $modalInstance.close();
        },
        goCreateExternal: function () {
            $state.go('app.private.init.createExternal');
            $modalInstance.close();
        }
    }

});
