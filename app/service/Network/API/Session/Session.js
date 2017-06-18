angular.module('Accounting').factory('Session', function ($localStorage, $rootScope) {

    return {
        set: function (data) {
            $localStorage.token = data.token;
            $localStorage.emailUser = data.email;
            $localStorage.application = data.app;
            $localStorage.ip = data.ip;
            $localStorage.idProfile = data.idProfile;
            $localStorage.idDependence = data.idDependence;
            $localStorage.dniUser = data.dniUser;
            $localStorage.codDependence = data.codDependence;
            $localStorage.descDependence = data.descDependence;
        },
        get: function () {
            return {
                token: $localStorage.token,
                email: $localStorage.emailUser,
                application: $localStorage.application,
                ip: $localStorage.ip,
                idProfile: $localStorage.idProfile,
                idDependence: $localStorage.idDependence,
                dniUser: $localStorage.dniUser,
                codDependence: $localStorage.codDependence,
                descDependence: $localStorage.descDependence
            };
        },
        status: function () {
            return $localStorage.token;
        },
        restartTime: function () {
            $rootScope.$emit("restartCountdown", {});
        }
    };

});
