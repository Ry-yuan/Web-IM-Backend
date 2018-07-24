var mongoose = require('../db-connect');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

var User = mongoose.model('User', userSchema);

module.exports = User;