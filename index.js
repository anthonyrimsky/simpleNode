// Add dependencies
var express = require('express');
var bodyparser = require('body-parser');

var config = require('./resources/config.js');

var mongoose = require('mongoose');
mongoose.connect(config.mongoURL());
mongoose.Promise = global.Promise;

var app = express();
app.use(bodyparser.json());

var register = require("./resources/register.js");
var login = require("./resources/login.js");
var rating = require("./resources/rating.js");
var films = require("./resources/get_film.js");
var get_user = require("./resources/get_user.js");

app.use('/register', register);
app.use('/login', login);
app.use('/rating', rating);
app.use('/films', films);
app.use('/user', get_user);

app.use(express.static('public'));

//provideDummyData();

app.listen(3000, function () {
   console.log("App is listening on port 3000");
});

function provideDummyData() {
// Add 2 movies to database to provide dummy data
    var Film = require('./model/Film.js');

    var films = [];

    var film1 = new Film({
        ttnumber: 'tt2369135',
        title: 'Need for Speed',
        release_date: 2014,
        duration: 112,
        director: 'Scott Waugh',
        description: 'Fresh from prison, a street racer who was framed by a wealthy business associate joins a cross country race with revenge in mind. His ex-partner, learning of the plan, places a massive bounty on his head as the race begins.'
    });
    var film2 = new Film({
        ttnumber: 'tt0499549',
        title: 'Avatar',
        release_date: 2009,
        duration: 162,
        director: 'James Cameron',
        description: 'A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.'
    });
    var film3 = new Film({
        ttnumber: 'tt0988045',
        title: 'Sherlock Holmes',
        release_date: 2009,
        duration: 128,
        director: 'Guy Ritchie',
        description: 'Detective Sherlock Holmes and his stalwart partner Watson engage in a battle of wits and brawn with a nemesis whose plot is a threat to all of England.'
    });

    var film4 = new Film({
        ttnumber: 'tt1515091',
        title: 'Sherlock Holmes: A Game of Shadows',
        release_date: 2011,
        duration: 129,
        director: 'Guy Ritchie',
        description: 'Sherlock Holmes and his sidekick Dr. Watson join forces to outwit and bring down their fiercest adversary, Professor Moriarty.'
    });

    films.push(film1);
    films.push(film2);
    films.push(film3);
    films.push(film4);

    for(var i = 0; i<films.length; i++) {
        films[i].save(function (err, result) {
            if (err) {
                console.error(err);
                return false;
            }
            if (result) {
                console.log(result);
                return true;
            }
        });
    }
    mongoose.disconnect();
}