/**
 * Created by declan on 17/7/27.
 */
var mongoose = require('mongoose');
var etherpad = require('./etherpad');
var async = require('async');
var debug = require('debug')('flexpad:pad');

var schema = new mongoose.Schema({
    // user
    username: { type: String, index: true },
    // object id of the accessed pad 
    objID: { type: mongoose.Schema.Types.ObjectId, ref: 'Pad' },
    // last access time
    access: { type: Date, default: Date.now },
    // access type
    readonly: Boolean
});

var PadAccess = mongoose.model('PadAccess', schema);

exports.accessPad = function(username, pad, callback) {
    var readonly = (pad.id == null);
    PadAccess.findOne({ username: username, objID: pad._id }, function(err, pa) {
        if (pa == null) {
            PadAccess.create({
                username: username,
                objID: pad._id,
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
}