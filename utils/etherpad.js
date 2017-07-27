/**
 * Created by declan on 17/7/26.
 */
const ep = require('etherpad-lite-client');
const debug = require('debug')('flexpad:etherpad');

var api = ep.connect({
    apikey: 'c93eb32f4c3ae920ae55dbdaac01e910e278de31f06340ba3c4bc8f78f79dd0b',
    host: 'localhost',
    port: 9001
});
var groupMapper = "flexpad-group";

exports.api = api;

exports.groupID = "";

exports.init = function (callback) {
    api.createGroupIfNotExistsFor({groupMapper: groupMapper}, function(err, data) {
        if (err) {
            callback("create etherpad group failed: " + JSON.stringify(err));
        } else {
            exports.groupID = data.groupID;
            console.log("connect to etherpad succeeded, groupID: " + data.groupID);
            callback();
        }
    });
};

exports.createPad = function (callback) {
    api.createGroupPad({groupID: exports.groupID, padName: randomPadName()}, function(err, data) {
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

function randomPadName() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = 16;
    var randomstring = '';
    for (var i = 0; i < string_length; i++)
    {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}