var express = require('express');
var router = express.Router();

var User = require('../model/User.js');
var config = require('../resources/config.js');

/**
 * New user registration
 * Requires a JSON object with a username, password, first_name, last_name and a preposition.
 */
router.post('', function (req, res) {
    var user = req.body;
    var username = req.body.username;
    var password = req.body.password;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var preposition = req.body.preposition;

    res.contentType('application/json');
    if (Object.keys(user).length == 5) {
        if (username.length >= 6 && password.length >= 6 && first_name != null && last_name != null && preposition != null) {
            var registration = new User({username: username, password: password, first_name: first_name, last_name: last_name, preposition: preposition});
            registration.save(function (err, result) {
                if (err) {
                    console.error(err);
                    res.status(403);
                    res.send(JSON.stringify('Duplicate username'));
                    return false;
                }
                if (result) {
                    res.status(201);
                    res.send(JSON.stringify('User created successfully'));
                    return true;
                }
            });
        }
        else {
            res.status(403);
            res.send(JSON.stringify("Invalid data. Pleae read the API manual :)"));
        }
    }
    else {
        res.status(403);
        res.send(JSON.stringify("Invalid data. Pleae read the API manual :)"));
    }
});

module.exports = router;