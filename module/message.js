var mongoose = require('../db-connect');

var Schema = mongoose.Schema;

var messageSchema = new Schema({
    username: { type: String, required: true, unique: true },
    peer:{type:String,required:true},
    historyMessage: [{
            sender:{type:String},
            time:{type:String},
            message:{type:String}
    }]
   });

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;