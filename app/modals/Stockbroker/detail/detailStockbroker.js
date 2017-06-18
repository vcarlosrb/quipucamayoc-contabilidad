angular.module('Accounting').controller('DetailStockbrokerCtrl', function ($scope, Data) {

    $scope.Services = {
        init: function () {
            this.getData();
        },
        getData: function () {
            $scope.Stockbroker = Data;
        }
    };
    $scope.Services.init();

});
