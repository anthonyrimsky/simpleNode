var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var filmSchema = new Schema({
    ttnumber: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    release_date: {type: Number, required: true},
    duration: {type: Number, required: true},
    director: {type: String, required: true},
    description: {type: String, required: true},
    ratings: {type: []}},
    {collection: 'Film'}
);

module.exports = mongoose.model('Film', filmSchema);