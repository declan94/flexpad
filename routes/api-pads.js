/**
 * Created by declan on 17/7/26.
 */
var express = require('express');
var model = require('../models/pad');
var router = express.Router();

router.get('/pads', function(req, res, next) {
    var user = req.session.user;
    model.getPads(user.username, function(err, pads) {
        if (err) {
            res.send(err);
        } else {
            res.json({items: pads});
        }
    });
});

router.get('/pads/:padID', function(req, res, next) {
    var padID = req.params.padID;
    model.getPad({padID: padID}, function(err, pad) {
        if (err) {
            res.send(err);
        } else {
            res.json({item: pad});
        }
    });
});


router.post('/pads', function(req, res, next) {
    var user = req.session.user;
    var title = req.body.title;
    model.createPad(user.username, title, function (err, pad) {
        if (err) {
            res.send(err);
        } else {
            res.json({item: pad});
        }
    });
});

module.exports = router;
