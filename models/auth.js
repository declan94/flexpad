/**
 * Created by declan on 17/7/26.
 */

var etherpad = require('./etherpad');

var fakeCheck = function(username, password, callback) {
    if (username.length > 0) {
        callback(null, {username: username, name: username});
    } else {
        callback("Not valid username!");
    }
};

exports.login = function (username, password, req, res, callback) {
    fakeCheck(username, password, function (err, user) {
        if (err) {
            callback(err);
        } else {
            req.session.user = user;
            etherpad.createSession(user, 2*60*60, function (err, sess) {
                if (err) {
                    callback(err);
                } else {
                    res.cookie('sessionID', sess.sessionID);
                    callback(null, user);
                }
            });
        }
    });
};