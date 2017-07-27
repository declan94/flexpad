exports.unwrapID = function(wrappedID, password, callback) {
    var readonly = false;
    var originID = wrappedID;
    if (wrappedID.match(/^g\./)) {
        readonly = false;
    } else if (wrappedID.match(/^r\./)) {
        readonly = true;
    } else {
        // todo add password protected
        return callback("Invalid padID: " + padID);
    }
    return callback(null, originID, readonly);
}