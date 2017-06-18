angular.module('Accounting').factory('DateService', function ($localStorage) {

    var months = [
        {
            name: 'Enero',
            id: 1
        },
        {
            name: 'Febrero',
            id: 2
        },
        {
            name: 'Marzo',
            id: 3
        },
        {
            name: 'Abril',
            id: 4
        },
        {
            name: 'Mayo',
            id: 5
        },
        {
            name: 'Junio',
            id: 6
        },
        {
            name: 'Julio',
            id: 7
        },
        {
            name: 'Agosto',
            id: 8
        },
        {
            name: 'Septiembre',
            id: 9
        },
        {
            name: 'Octubre',
            id: 10
        },
        {
            name: 'Noviembre',
            id: 11
        },
        {
            name: 'Diciembre',
            id: 12
        }
    ];
    return {
        getYears: function () {
            var date = new Date();
            var years = [];
            for (var i = date.getFullYear(); i >= 2014; i--) {
                years.push(i);
            }

            return years;
        },
        getMonths: function () {
            return months;
        },
        getMonth: function (nro) {
            var current = {};
           months.forEach(function (obj) {
               if(obj.id == nro) {
                   current = obj;
               }
           });

           return current;
        },
        saveDateStorage: function (form) {
            $localStorage.currentDate = JSON.stringify(form);
        },
        getDateStorage: function () {
            if($localStorage.currentDate) {
                return JSON.parse($localStorage.currentDate);
            } else {
                return undefined;
            }
        }
    };

});
