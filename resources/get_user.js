var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../resources/config.js');

var User = require('../model/User.js');

router.get('', function (req, res) {
    getUserFromDB(req, res);
});

router.get('/:username', function (req, res) {
    var username = req.params.username;
    getUserFromDB(req, res, username);
});

function getUserFromDB(req, res, username) {
    res.contentType('application/json');
    jwt.verify(req.header('Authorization'), config.secretKey(), function (err, decoded) {
        if (err) {
            res.status(401);
            res.send(JSON.stringify("Unauthorized, token not valid"));
            return false;
        }
        else {
            selector = {};
            if (username != null && username !== 'self') {
                selector = {"username": username};
                getOneUser(selector, res);
            }
            else if(username === 'self') {
                selector = {"username" : decoded.username};
                getOneUser(selector, res);
            }
            // Return list of users
            else {
                // Hide unnecessary and sensitive data (password) from result
                User.find(selector, {"_id": 0, "__v": 0, "password": 0}, function (err, result) {
                    if (err) {
                        console.error(err);
                    }
                    res.status(200);
                    res.send(result);
                });
            }
        }
    });
}

function getOneUser(selector, res) {
    // Hide unnecessary and sensitive data (password) from result
    User.findOne(selector, {"_id": 0, "__v": 0, "password": 0}, function (err, result) {
        if (err) {
            console.error(err);
        }
        res.status(200);
        res.send(result);
    });
}

module.exports = router;