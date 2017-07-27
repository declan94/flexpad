/**
 * Created by declan on 17/7/26.
 */
var mongoose = require('mongoose');
var etherpad = require('./etherpad');
var async = require('async');
var debug = require('debug')('flexpad:pad');

var schema = new mongoose.Schema({
    // user who own's the pad
    username: { type: String, index: true },
    // pad title
    title: String,
    // pad name in etherpad.
    id: { type: String, index: true, unique: true },
    // readonly id.
    rdID: { type: String, index: true, unique: true },
    access: { type: Date, default: Date.now }
});

var Pad = mongoose.model('Pad', schema);

exports.getPads = function(username, callback) {
    Pad.find({ username: username }, callback);
};

exports.getPad = function(padID, callback) {
    Pad.findOne({ id: padID }, callback);
};

exports.getRdPad = function(rdPadID, callback) {
    Pad.findOne({ rdID: rdPadID }, callback);
}

exports.createPad = function(username, title, callback) {
    async.waterfall([etherpad.createPad, etherpad.fillPadReadonlyID, function(ep, callback) {
        Pad.create({
            username: username,
            title: title,
            id: ep.padID,
            rdID: ep.readonlyID
        }, callback);
    }], callback);
};