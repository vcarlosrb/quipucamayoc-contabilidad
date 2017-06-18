angular.module('Accounting').controller('PrivateCtrl',function($scope, DateService){

    var date = new Date();
    if(DateService.getDateStorage()) {
        $scope.DateGlobal = {
            month: DateService.getMonth(DateService.getDateStorage().month),
            year: DateService.getDateStorage().year
        };
    } else {
        $scope.DateGlobal = {
            month: DateService.getMonth(date.getMonth() + 1),
            year: date.getFullYear()
        };
    }

    $scope.UtilsGlobal = {
        setDate: function (form) {
            form.month = DateService.getMonth(form.month);
            $scope.DateGlobal = form;
        }
    };

});
