angular.module('Accounting').controller('HeaderCtrl', function ($scope, $state, User, Session, $localStorage, $rootScope) {

    $scope.UserSession = {};
    var timeinterval = null;

    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function initializeClock(id, endtime) {
        var minutesSpan = $('.minutes');
        var secondsSpan = $('.seconds');

        function updateClock() {
            var t = getTimeRemaining(endtime);

            minutesSpan.html(('0' + t.minutes).slice(-2));
            secondsSpan.html(('0' + t.seconds).slice(-2));

            if (t.total <= 0) {
                clearInterval(timeinterval);
                $scope.Services.logout();
            }
        }

        updateClock();
        timeinterval = setInterval(updateClock, 1000);
    }

    $scope.CountDown = {
        init: function () {
            //days-hours-minutes-seconds
            var deadline = new Date(Date.parse(new Date()) + 20 * 60 * 1000);
            initializeClock('clockdiv', deadline);
        }
    };
    $scope.CountDown.init();

    $scope.Services = {
        log: true,
        constructor: function () {
            this.getData();
        },
        getData: function () {
            $scope.UserSession = Session.get();
        },
        logout: function () {
            if (this.log == true) {
                //stop interval timer
                this.log = false;
                var data = {
                    aplicacion: '101',
                    usuario: Session.get().email,
                    token: Session.get().token
                };
                User.logout(data).then(function (response) {
                    $localStorage.$reset();
                    $state.go('app.login');
                }, function (err) {
                    swal("¡Error!", err.data.mensaje, "error");
                });
            }
        }
    };
    $scope.Services.constructor();

    $rootScope.$on('restartCountdown', function () {
        clearInterval(timeinterval);
        $scope.CountDown.init();
    });

});
