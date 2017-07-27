/**
 * Created by declan on 17/7/26.
 */
var mongoose = require('mongoose');
var etherpad = require('./etherpad');
var async = require('async');

var schema = new mongoose.Schema({
    username: 'string',     // user who own's the pad
    title: 'string',        // pad title
    id: 'string',           // pad name in etherpad.
    rdID: 'string',         // readonly id.
    access: { type: Date, default: Date.now }
});

var Pad = mongoose.model('Pad', schema);

exports.getPads = function (username, callback) {
    Pad.find({username: username}, callback);
};

exports.getPad = function (pad, callback) {
    var padID = pad.padID;
    if (padID.match(/^g./)) {
        Pad.findOne({id: padID}, callback);
    } else if (padID.match(/^r./)) {
        Pad.findOne({rdID: padID}, callback);
    } else {
        // todo add password protected
        callback("Invalid padID: " + padID);
    }
};

exports.createPad = function (username, title, callback) {
    async.waterfall([etherpad.createPad, etherpad.fillPadReadonlyID, function (ep, callback) {
        Pad.create({username: username,
            title: title,
            id: ep.padID,
            rdID: ep.readonlyID
        }, callback);
    }], callback);
};