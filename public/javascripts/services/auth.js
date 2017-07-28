angular.module('flexpad')
    .factory('Auth', function(Base64, Relocate, $cookieStore, $http, $resource) {

        var service = $resource("/api/login", {}, {
            _login: { method: 'POST', cache: false }
        });

        service.currentUser = {};
        service._loggedIn = false;

        var setCredentials = function(username, password) {
            var authToken = username + ':' + password;
            var authdata = Base64.encode(authToken);
            service.currentUser = {};
            service.currentUser.username = username;
            service.currentUser.authdata = authdata;
            $http.defaults.headers.common.Authorization = 'Basic ' + authdata; // jshint ignore:line
            service._loggedIn = false;
        };

        var clearCredentials = function() {
            service.currentUser = {};
            $cookieStore.remove('CurrentUser');
            $http.defaults.headers.common.Authorization = 'Basic ';
            service._loggedIn = false;
        };

        service.getHeader = function() {
            if (service.currentUser && service.currentUser.authdata) {
                return "Basic " + service.currentUser.authdata;
            } else {
                return "Basic ";
            }
        };

        service.getUsername = function() {
            if (service.currentUser && service.currentUser.username) {
                return service.currentUser.username;
            } else {
                return null;
            }
        };

        service.getUserId = function() {
            if (service.currentUser && service.currentUser.userdata) {
                return service.currentUser.userdata.id;
            } else {
                return null;
            }
        };

        service.getUserdata = function() {
            if (service.currentUser && service.currentUser.userdata) {
                return service.currentUser.userdata;
            } else {
                return {};
            }
        };

        service.storeToCookie = function() {
            $cookieStore.put('CurrentUser', service.currentUser);
        };

        service.authFromCookie = function() {
            // keep user logged in after page refresh
            service.currentUser = $cookieStore.get('CurrentUser');
            if (!!service.currentUser && !!service.currentUser.authdata) {
                $http.defaults.headers.common.Authorization = 'Basic ' + service.currentUser.authdata; // jshint ignore:line
                service._loggedIn = true;
                return true;
            }
            return false;
        };

        service.loggedIn = function() {
            return service._loggedIn;
        };

        service.logout = function() {
            clearCredentials();
            Relocate.toLogin();
        };

        service.login = function(username, password, callback) {
            setCredentials(username, password);
            service._login({ username: username, password: password }, function(user) {
                console.log(user);
                service._loggedIn = true;
                service.currentUser.userdata = user;
                //setCredentials(username, password);
                callback(true, user);
            }, function(err) {
                clearCredentials();
                callback(false, err);
            });
        };

        return service;

    });