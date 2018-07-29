const connectMongodb = require('../db-connect');
const mongoose = require('mongoose');
const path = '/local';
connectMongodb(mongoose,path);
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sex: { type: String },
});

var User = mongoose.model('User', userSchema);

module.exports = User;