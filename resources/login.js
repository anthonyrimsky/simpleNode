var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../resources/config.js');

var User = require('../model/User.js');

/**
 * User login
 * Requires a username and a password
 * Returns a token if the credentials are correct.
 */
router.post('', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    res.contentType('application/json');

    // Get user from database.
    User.findOne({username: username}, function (err, results) {
        if (err) {
            return console.log(err);
        }
        if (results != null) {
            // Check if password is correct.
            if(password == results.password) {
                // Generate a JSON Webtoken.
                var token = jwt.sign({username: results.username, id: results._id}, config.secretKey(), {expiresIn: config.tokenExpiresIn()});
                res.status(201);
                res.send({token: token});
            }
            // Wrong password.
            else {
                res.status(401);
                res.send(JSON.stringify("Wrong credentials"));
            }
        }
        // User not found.
        else {
            res.status(401);
            res.send(JSON.stringify("Unknown user"));
        }
    });
});

module.exports = router;