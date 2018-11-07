const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sex: { type: String },
});

let User = mongoose.model('User', userSchema);

module.exports = User;