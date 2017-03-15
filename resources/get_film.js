var express = require('express');
var router = express.Router();
var config = require('../resources/config.js');

var Film = require('../model/Film.js');

router.get('/', function (req, res) {
    getFilms(req, res);
});

router.get('/:tt', function (req, res) {
    getFilms(req, res, req.params.tt);
});

function getFilms(req, res, ttnumber) {
    // Set content type to JSON.
    res.contentType('application/json');

    // Prepare query, use ttnumber if ttnumber is in url.
    var query = [];
    if(ttnumber != null)
    {
        query.push({ "$match": { "ttnumber": req.params.tt } });
    }
    query.push(
        { "$unwind":  {
            "path" : "$ratings",
            "preserveNullAndEmptyArrays": true
        }},
        { "$group": {
            "_id": "$_id",
            "ttnumber": { "$first": "$ttnumber" },
            "title": { "$first": "$title" },
            "release_date": { "$first": "$release_date" },
            "duration": { "$first": "$duration" },
            "director": { "$first": "$director" },
            "description": { "$first": "$description" },
            "avg_rating": { "$avg": "$ratings.rating" }
        }},
        { "$project" : {_id: 0, ttnumber : 1, title : 1, release_date: 1, duration: 1, director: 1, description: 1, avg_rating: 1}});

    // Execute the query and return result to user.
    Film.aggregate(query,
        function(err,result) {
            if(err) {
                res.status(500);
                res.send("Server error");
                return console.err(result);
            }
            if(result.length > 0) {
                res.status(200);
                res.send(result);
            }
            // Return 404 if movie not found
            else {
                res.status(404);
                res.send(JSON.stringify("Movie not found"));
            }
        }
    );
}

module.exports = router;