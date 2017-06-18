angular.module('Accounting').controller('OpeningcashCtrl', function ($scope, $state, Cash, Session) {

    $scope.ProfileId = Session.get().idProfile;
    $scope.SignupOpenings = [];
    $scope.SignupOpened = [];
    $scope.Search = {};
    $scope.SearchOpened = {};
    var currentDate = {};
    //El paginador divide el total de items entre 10 para el total de paginas
    $scope.Pagination = {
        total: null,
        current: null,
        maxSize: 10,
        changePage: function () {
            $scope.Services.searchSignupOpening($scope.Search);
        }
    };
    $scope.PaginationOpened = {
        total: null,
        current: null,
        maxSize: 10,
        changePage: function () {
            $scope.Services.searchSignupOpened($scope.SearchOpened);
        }
    };

    $scope.Events = {
        goDetail: function (id) {
            $state.go('app.private.init.openingCashDetail', {id: id});
        },
        goCashCreate: function (id) {
            $state.go('app.private.init.openingCashCreate', {id: id})
        },
        clearSearchOpening: function () {
            $scope.Search = {};
            $scope.Services.getSignupOpening($scope.Search);
        },
        clearSearchOpened: function () {
            $scope.SearchOpened = {};
            $scope.Services.getSignupOpened($scope.SearchOpened);
        }
    };

    $scope.Services = {
        page: 1,
        pageOpened: 1,
        loader: false,
        loaderOpened: false,
        constructor: function () {
            this.getSignupOpening($scope.Search);
            this.getSignupOpened($scope.SearchOpened);
        },
        getSignupOpening: function (form) {
            var self = this;
            var filter = null;
            self.loader = true;
            if (form.type) {
                switch (form.type) {
                    case '0':
                        filter = form.register;
                        break;
                    case '1':
                        filter = form.dependence;
                        break;
                    case '2':
                        filter = form.glossary;
                        break;
                }
            }
            Cash.listSignupOpening(currentDate.month.id, currentDate.year, this.page, form.type, filter).then(function (response) {
                if (response.data.cajasChicas.length > 0) {
                    response.data.cajasChicas.forEach(function (obj) {
                        obj.fecha = moment(obj.fecha).format('DD/MM/YYYY - h:mm:ss a');
                    });
                }
                $scope.Pagination.total = parseInt(response.data.paginaciones) * 10;
                $scope.Pagination.current = 1;
                $scope.SignupOpenings = response.data.cajasChicas;
                self.loader = false;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
                self.loader = false;
            });
        },
        searchSignupOpening: function (form) {
            var self = this;
            var filter = null;
            self.loader = true;
            if (form.type) {
                switch (form.type) {
                    case '0':
                        filter = form.register;
                        break;
                    case '1':
                        filter = form.dependence;
                        break;
                    case '2':
                        filter = form.glossary;
                        break;
                }
            }
            Cash.listSignupOpening(currentDate.month.id, currentDate.year, $scope.Pagination.current, form.type, filter).then(function (response) {
                if (response.data.cajasChicas.length > 0) {
                    response.data.cajasChicas.forEach(function (obj) {
                        obj.fecha = moment(obj.fecha).format('DD/MM/YYYY - h:mm:ss a');
                    });
                }
                $scope.SignupOpenings = response.data.cajasChicas;
                self.loader = false;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
                self.loader = false;
            });
        },
        getSignupOpened: function (form) {
            var self = this;
            var filter = null;
            self.loaderOpened = true;
            if (form.type) {
                switch (form.type) {
                    case '0':
                        filter = form.code;
                        break;
                    case '1':
                        filter = form.dependence;
                        break;
                    case '2':
                        filter = form.attendant;
                        break;
                    case '3':
                        filter = form.register;
                        break;
                }
            }
            Cash.listSignupOpened(currentDate.year, this.pageOpened, form.type, filter).then(function (response) {
                $scope.PaginationOpened.total = parseInt(response.data.paginaciones) * 10;
                $scope.PaginationOpened.current = 1;
                $scope.SignupOpened = response.data.cajasChicas;
                self.loaderOpened = false;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
                self.loader = false;
            });
        },
        searchSignupOpened: function (form) {
            var self = this;
            var filter = null;
            self.loaderOpened = true;
            if (form.type) {
                switch (form.type) {
                    case '0':
                        filter = form.code;
                        break;
                    case '1':
                        filter = form.dependence;
                        break;
                    case '2':
                        filter = form.attendant;
                        break;
                    case '3':
                        filter = form.register;
                        break;
                }
            }
            Cash.listSignupOpened(currentDate.year, $scope.PaginationOpened.current, form.type, filter).then(function (response) {
                $scope.SignupOpened = response.data.cajasChicas;
                self.loaderOpened = false;
            }, function (err) {
                swal("¡Error!", err.data.mensaje, "error");
                self.loader = false;
            });
        }
    };

    $scope.$watch('DateGlobal', function (nw, old) {
        currentDate = nw;
        $scope.Services.constructor();
    });

});
