var fs = require('fs');
var process = require('process');
var path = require('path');
var jsonminify = require('jsonminify');
var async = require('async');

var settingfile = path.normalize(path.join(__dirname, '../settings.json'));

var defaultSettings = {
    // etherpad host
    epHost: "localhost",
    // etherpad port
    epPort: 9001,
    // etherpad home directory
    epHome: null,

    // mongodb host
    mongoHost: "localhost",
    // mongodb port
    mongoPort: 27017,
    // mongdb db
    mongoDB: "flexpad",
    // mongodb user
    mongoUser: "flexpad",
    // mongodb user password
    mongoPwd: "cfflexpad",

    // app listen port
    port: 8081,

    // authTypes [fake/settings/api]
    authType: "fake",
    users: {}
};

try {
    var settingsStr = fs.readFileSync(settingfile).toString();
    settingsStr = jsonminify(settingsStr).replace(",]", "]").replace(",}", "}");
    var settings = JSON.parse(settingsStr);
    async.eachOf(settings, function(v, k, callback) {
        defaultSettings[k] = v;
        callback();
    });
} catch (e) {
    console.warn('Read settings file failed: ' + JSON.stringify(e) + '. Using default settings.');
}

module.exports = defaultSettings;