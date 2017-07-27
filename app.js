const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const etherpad = require('./utils/etherpad');
const basicAuth = require('./midwares/basic-auth');
const apiLogin = require('./routes/api-login');
const apiPads = require('./routes/api-pads');


var mongooseConnect = function(callback) {
  mongoose.connect('mongodb://flexpad:cfflexpad@localhost:27017/flexpad', {
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

  callback(null, app);
};

exports.initialFuncs = [
  etherpad.init,
  mongooseConnect,
  createApp
];