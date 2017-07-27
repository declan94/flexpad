/**
 * Created by declan on 17/7/26.
 */
var express = require('express');
var padModel = require('../models/pad');
var accessModel = require('../models/padaccess');
var idHandler = require('../models/padid');
var debug = require('debug')('flexpad:api-pads');
var router = express.Router();


router.get('/pads', function(req, res, next) {
    var user = req.session.user;
    padModel.getPads(user.username, function(err, pads) {
        if (err) {
            res.send(err);
        } else {
            res.json({ items: pads });
        }
    });
});

router.get('/pads/:wrappedID', function(req, res, next) {
    var user = req.session.user;
    var wrappedID = req.params.wrappedID;
    var password = req.query.password;
    idHandler.unwrapID(wrappedID, password, function(err, padID, readonly) {
        debug("get pad (" + wrappedID + " -> " + padID + ")");
        if (err) {
            return res.status(400).json({ msg: err });
        } else {
            var func = readonly ? padModel.getRdPad : padModel.getPad;
            func(padID, function(err, pad) {
                if (pad == null) {
                    return res.status(404).json({ msg: "Pad not found." });
                }
                if (readonly) {
                    pad.id = null;
                }
                accessModel.accessPad(user.username, pad, function(err) {
                    if (err) {
                        return res.status(500).json({ msg: "Unknown Error" });
                    }
                    return res.json({ item: pad });
                });
            });
        }
    });
});


router.post('/pads', function(req, res, next) {
    var user = req.session.user;
    var title = req.body.title;
    padModel.createPad(user.username, title, function(err, pad) {
        if (err) {
            res.send(err);
        } else {
            res.json({ item: pad });
        }
    });
});

module.exports = router;