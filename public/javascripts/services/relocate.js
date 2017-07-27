angular.module('flexpad')
    .factory('Relocate', function($location) {

        var service = { last: false };

        var toLocation = function(loc) {
            var path = $location.path();
            if (path.indexOf(loc) >= 0) {
                return;
            }
            if (path.indexOf('/login') < 0) {
                service.last = path;
            }
            $location.path(loc);
        };

        service.toLocation = toLocation;

        service.toLogin = function() {
            toLocation("/login");
        };

        service.toHome = function() {
            toLocation("/home");
        };

        service.toPad = function(pad) {
            toLocation("/pad/" + pad.id);
        };

        service.toBack = function(defaultPath) {
            console.log(service.last);
            $location.path(service.last || defaultPath || "/home");
        };

        return service;
    });