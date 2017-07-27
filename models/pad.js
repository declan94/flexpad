/**
 * Created by declan on 17/7/26.
 */
var mongoose = require('mongoose');
var etherpad = require('./etherpad');
var async = require('async');
var debug = require('debug')('flexpad:pad');

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

exports.getPad = function (p, callback) {
    var padID = p.padID;
    var readonly = false;
    var query;
    if (padID.match(/^g\./)) {
        query = {id: padID};
    } else if (padID.match(/^r\./)) {
        readonly = true;
        query = {rdID: padID};
    } else {
        // todo add password protected
        return callback("Invalid padID: " + padID);
    }
    async.waterfall([function(cb) {
        Pad.findOne(query, cb);
    }, function (pad, cb) {
        if (readonly) {
            pad.id = null;
        }
        cb(null, pad);
    }], callback);
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