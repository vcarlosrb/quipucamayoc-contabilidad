angular.module('Accounting').controller('CalendarCtrl', function ($scope, DateService, $modalInstance) {

    var date = new Date();
    $scope.Years = [];
    $scope.Months = [];
    $scope.Form = {};

    $scope.Events = {
        selectDate: function (form) {
            DateService.saveDateStorage(form);
            $modalInstance.close(form);
        }
    };

    $scope.Services = {
        constructor: function () {
            this.getDate();
        },
        getDate: function () {
            $scope.Years = DateService.getYears();
            $scope.Months = DateService.getMonths();

            if(DateService.getDateStorage()) {
                $scope.Years.forEach(function (item, iterator, array) {
                    if(DateService.getDateStorage().year == item) {
                        $scope.Form.year = array[iterator];
                    }
                });
                $scope.Form.month = $scope.Months[DateService.getDateStorage().month - 1].id;
            } else {
                $scope.Form = {
                    year: $scope.Years[0],
                    month: $scope.Months[date.getMonth()].id
                };
            }
        }
    };
    $scope.Services.constructor();

});
