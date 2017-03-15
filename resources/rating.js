var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../resources/config.js');

var Film = require('../model/Film.js');

router.put('/:tt', function (req, res) {
    res.contentType('application/json');
    if(req.body.rating >= 0.5 && req.body.rating <=5 && req.body.rating % 0.5 === 0) {
    jwt.verify(req.header('Authorization'), config.secretKey(), function (err, decoded) {
        if(err)
        {
            res.status(401);
            res.send(JSON.stringify("Unauthorized, token not valid"));
        }
        else {
            // Remove existing rating if available.
            Film.update({ttnumber: req.params.tt}, {$pull: {ratings: {userid: decoded.id}}}, function (err, ok) {
                if(err) {
                    console.log(err);
                }
            });
            // Add rating to db.
            Film.update({ttnumber: req.params.tt}, {$push: {ratings: {rating: req.body.rating, userid: decoded.id}}}, function (err, ok) {
               if(err) {
                   console.log(err);
               }
               if(ok.nModified == 1)
               {
                   res.status(201);
                   res.send(JSON.stringify("Rating added/modified"));
               }
               else {
                   res.status(404);
                   res.send(JSON.stringify("Movie not found"));
               }
            });
        }
    }); }
    else {
        res.status(401);
        res.send(JSON.stringify("Geen geldige rating, moet tussen 0.5 en 5.0 zijn en in stappen van 0.5"));
    }
});

/**
 * Remove a rating from a authorized user
 * Requires a header with token. Body should contain a JSON-object with a ttnumber
 */
router.delete('/:tt', function (req, res) {
    res.contentType('application/json');
    jwt.verify(req.header('Authorization'), config.secretKey(), function (err, decoded) {
        if(err)
        {
            res.status(401);
            res.send(JSON.stringify("Unauthorized, token not valid"));
        }
        else {
            // Remove existing.
            Film.update({ttnumber: req.params.tt}, {$pull: {ratings: {userid: decoded.id}}}, function (err, ok) {
                if(err) {
                    console.log(err);
                }
                if(ok.nModified == 1)
                {
                    console.log("Rating is removed");
                    res.status(201);
                    res.send(JSON.stringify("Rating is removed"));
                }
                else {
                    console.log("Rating not found");
                    res.status(404);
                    res.send(JSON.stringify("Rating not found"));
                }
            });
        }
    });
});

/**
 * Return current rating to user
 */
router.get('/:tt', function (req, res) {
    res.contentType('application/json');
    jwt.verify(req.header('Authorization'), config.secretKey(), function (err, decoded) {
        if(err)
        {
            res.status(401);
            res.send(JSON.stringify("Unauthorized, token not valid"));
        }
        else {
            // Get current rating.
            Film.findOne({"ttnumber": req.params.tt}, {_id: 0, ratings: {$elemMatch: {userid: decoded.id}}}, function (err, result) {
                if(err)
                {
                    console.error(err);
                }
                else if(result != null)
                {
                    res.send(result);
                }
            });
        }
    });
});

module.exports = router;