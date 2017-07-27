

angular.module('flexpad', ['ngRoute', 'ngResource', 'ngCookies', 'ui.bootstrap'])
    .config(function($routeProvider, $httpProvider) {
        $routeProvider
            .when("/pad/:padID", {
                templateUrl: "views/pad.html",
                controller: 'PadCtrl'
            })
            .when("/login", {
                templateUrl: "views/login.html",
                controller: 'LoginCtrl'
            })
            .otherwise({
                templateUrl: "views/home.html",
                controller: 'HomeCtrl'
            });

        /* Register error provider that shows message on failed requests or redirects to login page on
         * unauthenticated requests */
        $httpProvider.interceptors.push(function ($q, Relocate) {
            return {
                'responseError': function(rejection) {
                    var status = rejection.status;
                    var config = rejection.config;
                    var method = config.method;
                    var url = config.url;

                    if (status === 401) {
                        Relocate.toLogin();
                    } else {
                        console.debug(method + " on " + url + " failed with status " + status);
                    }
                    return $q.reject(rejection);
                }
            };
        });
    })
    .run(function (Auth, Relocate) {
        if (!Auth.authFromCookie()) {
            Relocate.toLogin();
        }
    });