const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let messageSchema = new Schema({
    username:{type:String,required:true},
    peer:{type:String,required:true},
    historyMessage: [{
            sender:{type:String},
            time:{type:String},
            message:{type:String},
            picture:{type:String}
    }]
   });

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;