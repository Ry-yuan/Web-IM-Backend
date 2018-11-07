const mongoose = require('mongoose');
const config = require('./config');
let connectMongodb = ()=>{
     //连接数据库
    mongoose.connect(config.mongodbPath);
    mongoose.connection.on('connected', function () {    
        console.log('Mongoose connection open to ' + config.mongodbPath); 
    }); 
    
    // 断开连接
    mongoose.connection.on('disconnected', function () {    
        console.log('Mongoose connection disconnected');  
    });
};

module.exports = connectMongodb;