/**
 * Created by declan on 17/7/26.
 */
var express = require('express');
var auth = require('../models/auth');
var router = express.Router();



router.post('/login', function(req, res, next) {
    //Test code
    var data = req.body;
    auth.login(data.username, data.password, req, res, function (err, user) {
       if (err) {
           res.status(403).send(err);
       } else {
           res.json(user);
       }
    });
});

module.exports = router;
