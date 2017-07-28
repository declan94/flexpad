/**
 * Created by declan on 17/7/26.
 */

var etherpad = require('./etherpad');
var settings = require('./settings');

var fakeCheck = function(username, password, callback) {
    if (username.length > 0) {
        return callback(null, { username: username, name: username });
    } else {
        return callback("Not valid username!");
    }
};

var settingsCheck = function(username, password, callback) {
    if (!settings.users[username]) {
        return callback("Wrong username!");
    }
    var user = settings.users[username];
    user.username = username;
    if (user.password != password) {
        return callback("Wrong password!");
    }
    return callback(null, user);
};

var apiCheck = function(username, password, callback) {
    // todo
    fakeCheck(username, password, callback);
};

exports.login = function(username, password, req, res, callback) {
    var checkFunc;
    if (settings.authType == 'fake') {
        checkFunc = fakeCheck;
    } else if (settings.authType == 'settings') {
        checkFunc = settingsCheck;
    } else {
        checkFunc = apiCheck;
    }
    checkFunc(username, password, function(err, user) {
        if (err) {
            callback(err);
        } else {
            req.session.user = user;
            etherpad.createSession(user, 2 * 60 * 60, function(err, sess) {
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