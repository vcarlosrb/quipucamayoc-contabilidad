angular.module('Accounting', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngStorage', 'ngAnimate', 'ngMaterial']);

angular.module('Accounting').config(function ($stateProvider, $urlRouterProvider, $locationProvider, $mdDateLocaleProvider) {
    //$locationProvider.html5Mode({
    //  enabled: true,
    //  requireBase: false
    //});

    $stateProvider.state('app', {
        url: '/',
        abstract: true
    });

    $stateProvider.state('app.login', {
        url: 'login',
        parent: 'app',
        views: {
            '@': {
                templateUrl: 'partial/public/login//login.html'
            }
        }
    });

    $stateProvider.state('app.error', {
        url: 'error',
        parent: 'app',
        views: {
            '@': {
                templateUrl: 'partial/public/error//error.html'
            }
        }
    });

    $stateProvider.state('app.private', {
        url: '',
        parent: 'app',
        abstract: true,
        resolve: {
            Session: function ($timeout, Session, $state) {
                if (Session.status() == undefined) {
                    $timeout(function () {
                        $state.go('app.login');
                    });
                }
            }
        },
        views: {
            '@': {
                templateUrl: 'partial/authState/private//private.html'
            }
        }
    });

    $stateProvider.state('app.private.init', {
        url: '',
        abstract: true,
        parent: 'app.private',
        views: {
            'header': {
                templateUrl: 'partial/base/header//header.html'
            },
            'panel': {
                templateUrl: 'partial/base/panel//panel.html'
            },
            'structure': {
                templateUrl: 'partial/authState/structure//structure.html'
            }
        }
    });

    $stateProvider.state('app.private.init.home', {
        url: '',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/base/home//home.html'
            }
        }
    });

    $stateProvider.state('app.private.init.stockbroker', {
        url: 'bolsista',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/maintenance/stockbroker//stockbroker.html'
            }
        }
    });

    $stateProvider.state('app.private.init.provider', {
        url: 'proveedor',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/maintenance/provider//provider.html'
            }
        }
    });

    $stateProvider.state('app.private.init.createProvider', {
        url: 'crear/proveedor',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/maintenance/createProvider//createProvider.html'
            }
        }
    });

    $stateProvider.state('app.private.init.detailProvider', {
        url: 'proveedor/:ruc',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/maintenance/detailProvider//detailProvider.html'
            }
        }
    });

    $stateProvider.state('app.private.init.createExternal', {
        url: 'crear/servicio_tercero',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/maintenance/createExternal//createExternal.html'
            }
        }
    });

    $stateProvider.state('app.private.init.detailExternal', {
        url: 'servicio_tercero/:ruc',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/maintenance/detailExternal//detailExternal.html'
            }
        }
    });

    $stateProvider.state('app.private.init.openingCash', {
        url: 'proceso/apertura_caja_chica',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/process/manage/openingCash//openingCash.html'
            }
        }
    });

    $stateProvider.state('app.private.init.openingCashCreate', {
        url: 'proceso/apertura_caja_chica/create/:id',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/process/manage/openingCashCreate//openingCashCreate.html'
            }
        }
    });

    $stateProvider.state('app.private.init.openingCashDetail', {
        url: 'proceso/apertura_caja_chica/:id',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/process/manage/openingCashDetail//openingCashDetail.html'
            }
        }
    });

    $stateProvider.state('app.private.init.settlementCash', {
        url: 'proceso/liquidacion_caja_chica',
        parent: 'app.private.init',
        views: {
            'content': {
                templateUrl: 'partial/process/manage/settlementCash//settlementCash.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refund', {
        url: 'proceso/reembolso',
        parent: 'app.private.init',
        abstract: true,
        views: {
            'content': {
                templateUrl: 'partial/process/register/refund//refund.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refund.init', {
        url: '',
        parent: 'app.private.init.refund'
    });

    $stateProvider.state('app.private.init.refund.structure', {
        url: '/:refund',
        parent: 'app.private.init.refund',
        abstract: true,
        views: {
            'refund': {
                templateUrl: 'partial/process/register/structureSpending//structureSpending.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refund.structure.expenses', {
        url: '',
        parent: 'app.private.init.refund.structure',
        views: {
            'spending': {
                templateUrl: 'partial/process/register/expenses//expenses.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refund.structure.createSpending', {
        url: '/crear_gasto',
        parent: 'app.private.init.refund.structure',
        views: {
            'spending': {
                templateUrl: 'partial/process/register/createSpending//createSpending.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refund.structure.detailSpending', {
        url: '/gasto/:spending',
        parent: 'app.private.init.refund.structure',
        views: {
            'spending': {
                templateUrl: 'partial/process/register/detailSpending//detailSpending.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refund.structure.accountingSpending', {
        url: '/registro_contable',
        parent: 'app.private.init.refund.structure',
        views: {
            'spending': {
                templateUrl: 'partial/process/register/accountingSpending//accountingSpending.html'
            }
        }
    });


    //Validar reembolso
    $stateProvider.state('app.private.init.refundValidate', {
        url: 'proceso/validar/reembolso',
        parent: 'app.private.init',
        abstract: true,
        views: {
            'content': {
                templateUrl: 'partial/process/validate/refundValidate//refundValidate.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refundValidate.init', {
        url: '',
        parent: 'app.private.init.refundValidate'
    });

    $stateProvider.state('app.private.init.refundValidate.structure', {
        url: '/:refund',
        parent: 'app.private.init.refundValidate',
        abstract: true,
        views: {
            'refund': {
                templateUrl: 'partial/process/validate/structureSpendingValidate//structureSpendingValidate.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refundValidate.structure.expenses', {
        url: '',
        parent: 'app.private.init.refundValidate.structure',
        views: {
            'spending': {
                templateUrl: 'partial/process/validate/expensesValidate//expensesValidate.html'
            }
        }
    });

    $stateProvider.state('app.private.init.refundValidate.structure.detailSpending', {
        url: '/gasto/:spending',
        parent: 'app.private.init.refundValidate.structure',
        views: {
            'spending': {
                templateUrl: 'partial/process/validate/detailSpendingValidate//detailSpendingValidate.html'
            }
        }
    });

    $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
    $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
    $mdDateLocaleProvider.msgCalendar = 'Calendario';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';
    $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('DD-MM-YYYY');
    };


    /* Add New States Above */
    $urlRouterProvider.otherwise('/');

});

angular.module('Accounting').run(function ($rootScope, Path, PathSession, PathSunat) {

    $rootScope.safeApply = function (fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.Path = Path;
    $rootScope.PathSession = PathSession;
    $rootScope.PathSunat = PathSunat;

}).constant('Path', 'http://quipucamayoc.unmsm.edu.pe/ContabilidadWeb/api/')
    .constant('PathSession', 'http://quipucamayoc.unmsm.edu.pe/SistemaControlAcceso/api/')
    .constant('PathSunat', 'http://quipucamayoc.unmsm.edu.pe/sunat-web/api/');

angular.module('Accounting').controller('MainCtrl', function ($scope, User, Session, $localStorage) {


});
