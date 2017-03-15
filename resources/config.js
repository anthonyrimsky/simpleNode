var secretKey = 'mySecret';
var mongoURL = 'mongodb://127.0.0.1/movies';
var expiresIn = 60*60;

var x = function getSecretKey() {
    return secretKey;
};

var y = function (getMongoURL) {
    return mongoURL;
};

var z = function () {
    return expiresIn;
};

module.exports.secretKey = x;
module.exports.mongoURL = y;
module.exports.tokenExpiresIn = z;