var fs = require('fs');
var process = require('process');
var path = require('path');
var jsonminify = require('jsonminify');
var async = require('async');

var settingfile = path.normalize(path.join(__dirname, '../app_settings.json'));

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

    // settings: reading from settings.users
    // api: using http api to auth
    authType: "settings",
    users: {}
};

try {
    var settingsStr = fs.readFileSync(settingfile).toString();
} catch (e) {
    console.error('Read settings file failed: ' + JSON.stringify(e));
    process.exit()
}

try {
    settingsStr = jsonminify(settingsStr).replace(",]", "]").replace(",}", "}");
    var settings = JSON.parse(settingsStr);
} catch (e) {
    console.error('Parse setting file failed');
    process.exit()
}

async.eachOf(settings, function(v, k, callback) {
    defaultSettings[k] = v;
    callback();
});

module.exports = defaultSettings;