/**
 * Created by declan on 17/7/26.
 */

var auth = require('../models/auth');
var debug = require('debug')('flexpad:auth');


//checks for basic http auth
module.exports = function(req, res, next) {

    var authorize = function(cb) {
        // Skip special urls
        debug("auth: " + req.path);
        if (!req.path.match(/^\/api/) || req.path.match(/^\/api\/login$/)) {
            return cb(true);
        }
        var sess = req.session;
        if (sess.user && sess.user.username && sess.user.name) {
            return cb(true);
        }
        // If auth headers are present use them to authenticate...
        if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
            var userpass = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString().split(":")
            var username = userpass.shift();
            var password = userpass.join(':');
            auth.login(username, password, req, res, function(err) {
                cb(err == null);
            });
        }
    };

    /* Authentication OR authorization failed. */
    var failure = function() {
        // res.header('WWW-Authenticate', 'Basic realm="Protected Area"');
        if (req.headers.authorization) {
            setTimeout(function() {
                res.status(401).send('Authentication required');
            }, 1000);
        } else {
            res.status(401).send('Authentication required');
        }
    };

    authorize(function(ok) {
        if (ok) return next();
        else failure()
    });

};