/**
 * Created by declan on 17/7/27.
 */
var mongoose = require('mongoose');
var etherpad = require('./etherpad');
var async = require('async');
var debug = require('debug')('flexpad:pad');
var padDao = require('./pad').Dao;

var schema = new mongoose.Schema({
    // user
    username: { type: String, index: true },
    // object id of the accessed pad 
    _pad: { type: mongoose.Schema.Types.ObjectId, ref: 'Pad' },
    // last access time
    access: { type: Date, default: Date.now },
    // access type
    readonly: Boolean
});

var PadAccess = mongoose.model('PadAccess', schema);

exports.accessPad = function(username, pad, callback) {
    var readonly = (pad.id == null);
    async.parallel([
        // update access collection
        function(callback) {
            PadAccess.findOne({ username: username, _pad: pad._id }, function(err, pa) {
                if (pa == null) {
                    PadAccess.create({
                        username: username,
                        _pad: pad._id,
                        readonly: readonly
                    }, callback);
                } else {
                    readonly = readonly && pa.readonly;
                    PadAccess.update({ _id: pa._id }, {
                        $set: { readonly: readonly },
                        $currentDate: { access: true }
                    }, callback);
                }
            });
        },
        // update pad collection
        function(callback) {
            padDao.update({ _id: pad._id }, { $currentDate: { access: true } }, callback);
        }
    ], function(err, results) {
        if (err) {
            return callback(err);
        }
        return callback(null, results[0]);
    });
}

exports.getPads = function(username, callback) {
    PadAccess.find({ username: username }).sort({ access: -1 })
        .populate("_pad").exec(callback);
}