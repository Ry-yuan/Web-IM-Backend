let connectMongodb = ((mongoose,path)=>{
    const DB_URL = 'mongodb://localhost:27017'+path;
    //连接数据库
    mongoose.connect(DB_URL);
    mongoose.connection.on('connected', function () {    
        console.log('Mongoose connect success'); 
        console.log('Mongoose connection open to ' + DB_URL); 
    }); 
    
    
    // 断开连接
    mongoose.connection.on('disconnected', function () {    
        console.log('Mongoose connection disconnected');  
    });  
});


module.exports = connectMongodb;