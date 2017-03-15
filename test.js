var supertest = require('supertest');

var server = supertest.agent("http://localhost:3000");

describe("Get all movies test", function () {
    it("should return all the available movies", function (done) {
        server.get("/films").expect(200).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe("Get movie with id tt2369135", function () {
    it("should return movie with id tt2369135", function (done) {
        server.get("/films/tt2369135").expect(200).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe("Get non existing movie", function () {
    it("should return a 404 not found error", function (done) {
        server.get("/films/tt2369148").expect(404).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe("Register a user with empty body", function () {
    it("should return 403 Forbidden", function (done) {
        server.post("/register").expect(403).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe("Register a user", function () {
    it("should add an user to the database", function (done) {
        var user = {
            username: "Robert",
            password: "test12",
            first_name: "Robert",
            last_name: "Mekenkamp",
            preposition: ""
        };
        server.post("/register").send(user).expect(201).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe("Add the same user again", function () {
    it("should not be added to the database", function (done) {
        var user = {
            username: "Robert",
            password: "test12",
            first_name: "Robert",
            last_name: "Mekenkamp",
            preposition: ""
        };
        server.post("/register").send(user).expect(403).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe("Login with incorrect password", function () {
    it("should receive a 401 status", function (done) {
        var credentials = {username: "Robert", password: "test13"};
        server.post("/login").send(credentials).expect(401).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe("Login with incorrect username", function () {
    it("should receive a 401 status", function (done) {
        var credentials = {username: "Robert1", password: "test13"};
        server.post("/login").send(credentials).expect(401).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe("Login with correct credentials", function () {
    it("should receive a 201 status", function (done) {
        var credentials = {username: "Robert", password: "test12"};
        server.post("/login").send(credentials).expect(201).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe('Add, modify and delete ratings with correct token', function() {
    var token = null;

    before(function(done) {
            server.post('/login')
            .send({ username: "Robert", password: "test12" })
            .end(function(err, res) {
                token = res.body.token;
                done();
            });
    });

    it('should add the rating to a movie', function(done) {
        server.put('/rating/tt2369135').set('Authorization', token).send({rating: 3})
            .expect(201).expect("Content-Type", /json/).end(done);
    });

    it('should modify the rating', function(done) {
        server.put('/rating/tt2369135').set('Authorization', token).send({rating: 4})
            .expect(201).expect("Content-Type", /json/).end(done);
    });

    it('should get the current rating', function(done) {
        server.get('/rating/tt2369135').set('Authorization', token).send()
            .expect(200).expect("Content-Type", /json/).end(done);
    });

    it('should delete the rating', function(done) {
        server.delete('/rating/tt2369135').set('Authorization', token).send()
            .expect(201).expect("Content-Type", /json/).end(done);
    });

    it('try to delete a non-existing rating', function(done) {
        server.delete('/rating/tt2369135').set('Authorization', token).send()
            .expect(404).expect("Content-Type", /json/).end(done);
    });

    it('should not add a rating to a non-existing movie', function(done) {
        server.put('/rating/tt2369136').set('Authorization', token).send({rating: 3})
            .expect(404).expect("Content-Type", /json/).end(done);
    });

    it('should not add rating > 5 to a movie', function(done) {
        server.put('/rating/tt2369135').set('Authorization', token).send({rating: 5.1})
            .expect(401).expect("Content-Type", /json/).end(done);
    });

    it('should not add rating < 0.5 to a movie', function(done) {
        server.put('/rating/tt2369135').set('Authorization', token).send({rating: 0.4})
            .expect(401).expect("Content-Type", /json/).end(done);
    });

    it('should not add rating 0.6 to a movie', function(done) {
        server.put('/rating/tt2369135').set('Authorization', token).send({rating: 0.6})
            .expect(401).expect("Content-Type", /json/).end(done);
    });
});

describe("Add rating without authorization token", function () {
    it("should receive a 401 status", function (done) {
        var rating = {rating: 3};
        server.put("/rating/tt2369135").send(rating).expect(401).expect("Content-Type", /json/).end(function (err, res) {
                done(err);
        });
    })
});

describe("Add rating invalid token", function () {
    it("should receive a 401 status", function (done) {
        var rating = {rating: 3};
        server.put("/rating/tt2369135").set('Authorization', 'x').send(rating).expect(401).expect("Content-Type", /json/).end(function (err, res) {
            done(err);
        });
    })
});

describe('Get current user and user list', function() {
    var token = null;

    before(function(done) {
        server.post('/login')
            .send({ username: "Robert", password: "test12" })
            .end(function(err, res) {
                token = res.body.token;
                done();
            });
    });

    it('get list of users', function(done) {
        server.get('/user').set('Authorization', token).send()
            .expect(200).expect("Content-Type", /json/).end(done);
    });

    it('get information of current user', function(done) {
        server.get('/user/Robert').set('Authorization', token).send()
            .expect(200).expect("Content-Type", /json/).end(done);
    });
});

describe('try to get current user and user list when not authorized', function() {

    it('should not get a list of users without token', function(done) {
        server.get('/user').send()
            .expect(401).expect("Content-Type", /json/).end(done);
    });

    it('should not get information of an individual user', function(done) {
        server.get('/user/Robert').set('Authorization', 'invalid-token').send()
            .expect(401).expect("Content-Type", /json/).end(done);
    });
});