var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    preposition: {type: String, required: false}},
    {collection: 'User'});

module.exports = mongoose.model('User', userSchema);