angular.module('Accounting').controller('TypedocumentCtrl',function($scope, Data, $modalInstance){

    $scope.Documents = [];
    $scope.Filter = {};
    $scope.currentDocument = {};

    $scope.Events = {
        select: function (event, item) {
            $('.modTypeDocument .tableContent tbody tr').css('background-color', 'white');
            $(event.currentTarget).css('background-color', 'rgb(230,230,230)');
            $scope.currentDocument = item;
        },
        accept: function () {
            $modalInstance.close($scope.currentDocument);
        }
    };

    $scope.Services = {
        constructor: function () {
            this.getData();
        },
        getData: function () {
            $scope.Documents = Data;
        }
    };
    $scope.Services.constructor();

});
