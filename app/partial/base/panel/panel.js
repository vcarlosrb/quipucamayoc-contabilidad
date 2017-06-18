angular.module('Accounting').controller('PanelCtrl',function($scope, $modal, Session){

    var vm = this;
    $scope.profileId = null;

    vm.Events = {
        toggleMenu: function (event) {
            var block = $(event.currentTarget).parent().find('.subItems');
            block.stop().slideToggle(200);
        },
        subToggleMenu: function (event) {
            var block = $(event.currentTarget).parent().find('.secondSubItems');
            block.stop().slideToggle(200);
        },
        showCalendar: function () {
            $modal.open({
                templateUrl: 'modals/Calendar/Calendar.html',
                controller: 'CalendarCtrl',
                windowClass: 'app-modal-calendar'
            }).result.then(function(result){
                $scope.UtilsGlobal.setDate(result);
            });
        }
    };

    $scope.Services = {
        constructor: function () {
            this.getData();
        },
        getData: function () {
            $scope.profileId = Session.get().idProfile;
        }
    };
    $scope.Services.constructor();

});
