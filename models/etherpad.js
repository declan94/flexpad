/**
 * Created by declan on 17/7/26.
 */
var ep = require('etherpad-lite-client');
var async = require('async');
var settings = require('./settings');
var path = require('path');
var fs = require('fs');
var process = require('process');
var debug = require('debug')('flexpad:etherpad');

try {
    var apiKeyFile = path.resolve(path.join(settings.epHome, "APIKEY.txt"));
    var apiKey = fs.readFileSync(apiKeyFile).toString();
} catch (e) {
    console.error('Read etherpad apikey failed: ' + JSON.stringify(e));
    process.exit()
}

var api = ep.connect({
    apikey: apiKey,
    host: settings.epHost,
    port: settings.epPort
});
var groupMapper = "flexpad-group";
var myGroupID = "";

exports.api = api;

exports.init = function(callback) {
    api.createGroupIfNotExistsFor({ groupMapper: groupMapper }, function(err, data) {
        if (err) {
            callback("create etherpad group failed: " + JSON.stringify(err));
        } else {
            myGroupID = data.groupID;
            debug("connect to etherpad succeeded, groupID: " + data.groupID);
            callback();
        }
    });
};

exports.createPad = function(callback) {
    api.createGroupPad({ groupID: myGroupID, padName: randomPadName() }, function(err, data) {
        if (err) {
            if (err.message == "pad does already exist") {
                exports.createPad(callback);
            } else {
                debug("create pad failed: " + JSON.stringify(err));
                callback(err);
            }
        } else {
            callback(null, data);
        }
    });
};

// fill pad.rdID
exports.fillPadReadonlyID = function(pad, callback) {
    api.getReadOnlyID(pad, function(err, data) {
        if (err) {
            debug("get pad readonlyID failed: " + JSON.stringify(err));
            callback(err);
        } else {
            pad.readonlyID = data.readOnlyID;
            callback(null, pad);
        }
    });
};

exports.createSession = function(user, expireSec, callback) {
    if (expireSec < 600) {
        expireSec = 600;
    }
    var createAuthor = function(callback) {
        api.createAuthorIfNotExistsFor({ authorMapper: user.username, name: user.name }, callback);
    };
    var createSession = function(author, callback) {
        api.createSession({
            groupID: myGroupID,
            authorID: author.authorID,
            validUntil: Date.now() / 1000 + expireSec
        }, callback);
    };
    async.waterfall([createAuthor, createSession], callback);
};

function randomPadName() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = 16;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}