/**
 * Created by declan on 17/7/26.
 */
const mongoose = require('mongoose');
const etherpad = require('../utils/etherpad');
const async = require('async');

var schema = new mongoose.Schema({
    username: 'string',     // user who own's the pad
    title: 'string',        // pad title
    id: 'string'       // pad name in etherpad. whole name should be g.xxxx${id}
});

var Pad = mongoose.model('Pad', schema);

exports.getPads = function(username, callback) {
    Pad.find({username: username}, callback);
};

exports.createPad = function(username, title, callback) {
    async.waterfall([etherpad.createPad, function (ep, callback) {
        Pad.create({username: username, title: title, id: ep.padID}, callback);
    }], callback);
};