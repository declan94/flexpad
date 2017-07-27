/**
 * Created by declan on 17/7/26.
 */

angular.module('flexpad')
    .factory('Pads', function ($resource) {
        var path = "/api/pads/:padID";
        return $resource(path, {},
            {
                get: {method: 'GET', cache: false},
                create: {method: 'POST'}
            });
    });
