/**
 * Created by declan on 17/7/26.
 */
var express = require('express');
var router = express.Router();


router.post('/login', function(req, res, next) {
    //Test code
    if (req.body.username.length > 0) {
        res.json({username: req.body.username, name: req.body.username})
    } else {
        res.status(403).json({error: "wrong username"})
    }
});

module.exports = router;
