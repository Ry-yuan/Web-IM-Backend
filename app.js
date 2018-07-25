let app = require('express')();
let server = require('http').Server(app);
// websocket工具
let io = require('socket.io')(server);
// mongodb数据库工具
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('./module/user.js');
// api路由
let Router = require('./router');
// 端口
const PORT  = process.env.PORT || 8000;
// 解析post数据
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// express-session
let session = require('express-session');
let FileStore = require('session-file-store')(session);
app.use(session({
    secret: 'sid',
    resave: false,
    store: new FileStore(),
    saveUninitialized: true,
    cookie: {
        maxAge: 6000 * 1000  // 有效期，单位是毫秒
    }
  }))

// 引入路由
Router(app);

server.listen(8000,()=>{console.log(`Server Start at  ${PORT} port .......`)});






// 保存数据
// u1.save(function(err,res){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log('Result'+res);
//     }
// })



/**
 * 更新数据
 * Model.update(conditions, update, [options], [callback])
 */

/**
 * 删除数据
 * Model.remove(conditions, [callback])
 */
var removeString = {'username':'ee'}

User.remove(removeString,function(err,res){
    if(err){
        console.log(err);
    }
    // console.log('remove'+res);
})
/**
 * 条件查询
 * Model.find(conditions, [fields], [options], [callback])
 */
var whereString = {'age':'12'}
User.find(whereString,function(err,res){
    if(err){
        console.log(err);
    }
    // console.log('Result'+res);
})







// 数组存储登录的用户
let userlist = [];
// 事件：当有用户连接触发
io.on('connection',function(socket){
    
    // 监听增加用户
    socket.on('new user',function(data){
        console.log('new user:');
        console.log(data);
        // 增加一个用户，保存用户列表
        userlist.push({
            username:data.username,
            socketid:socket.id
        });
        // console.log(userlist);
        // 广播消息（包括自己）
        io.sockets.emit('broadcast message all', userlist);
    })
    

    
    // 用户断开连接时的操作
    socket.on('disconnect', function(){
        userlist.forEach((item,index)=>{
            if(item.socketid === socket.id){
                // 断开链接后删除
                userlist.splice(index,index+1);
            }
            // console.log(userlist);
        });
        // 广播消息（包括自己）
        io.sockets.emit('broadcast message all', userlist);
    });

    // 每个连接都有一个socket.id
    // console.log(socket.id);

    // 定义news，仅仅发送给自己
    // socket.emit('news',{hello:'ry'});

    // 监听私人消息
    socket.on("send private message" , function(data){
        console.log(data);
        let message = {
            time:data.time,
            message:data.message
        }
        // 发送信息给对应用户
        socket.to(data.socketid).emit('receive private meassge', message);
    })
});
