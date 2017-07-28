var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var settings = require('./models/settings');
var etherpad = require('./models/etherpad');
var basicAuth = require('./midwares/basic-auth');
var apiLogin = require('./routes/api-login');
var apiPads = require('./routes/api-pads');

var mongooseConnect = function(callback) {
    var url = 'mongodb://' + settings.mongoUser + ":" + settings.mongoPwd +
        "@" + settings.mongoHost + ":" + settings.mongoPort + "/" + settings.mongoDB;
    mongoose.connect(url, {
        useMongoClient: true
    }).then(function() {
        console.log("connect mongodb succeeded");
        callback();
    }, function(err) {
        callback("connect mongodb failed：" + JSON.stringify(err));
    });
};

var createApp = function(callback) {
    var app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session({
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        secret: 'cloudfortdeclancfflexpad',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: true }
    }));
    app.use(basicAuth);
    app.use('/api', apiLogin);
    app.use('/api', apiPads);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    /**
     * set port
     */
    app.set('port', settings.port || '3000');

    callback(null, app);
};

exports.initialFuncs = [
    etherpad.init,
    mongooseConnect,
    createApp
];