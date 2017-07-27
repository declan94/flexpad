/**
 * Created by declan on 17/7/26.
 */

angular.module('flexpad')
    .factory('Pads', function ($resource) {
        var path = "/api/pads/:padId";
        return $resource(path, {},
            {
                get: {method: 'GET', cache: false},
                create: {method: 'POST'}
            });
    });
