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
const PORT = process.env.PORT || 8000;
// 解析post数据
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// express-session
let session = require('express-session');
let FileStore = require('session-file-store')(session);

// message schema
let Message = require('./module/message.js');
app.use(session({
    secret: 'sid',
    resave: false,
    store: new FileStore(),
    saveUninitialized: true,
    cookie: {
        maxAge: 6000 * 1000 // 有效期，单位是毫秒
    }
}))

// 引入路由
Router(app);

server.listen(8000, () => {
    console.log(`Server Start at  ${PORT} port .......`)
});






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
var removeString = {
    'username': 'ee'
}

User.remove(removeString, function (err, res) {
    if (err) {
        console.log(err);
    }
    // console.log('remove'+res);
})
/**
 * 条件查询
 * Model.find(conditions, [fields], [options], [callback])
 */
var whereString = {
    'age': '12'
}
User.find(whereString, function (err, res) {
    if (err) {
        console.log(err);
    }
    // console.log('Result'+res);
})







// 数组存储登录的用户
let userlist = [];
// 事件：当有用户连接触发
io.on('connection', function (socket) {

    // 监听增加用户
    socket.on('new user', function (data) {
        console.log('new user:');
        console.log(data);
        // 增加一个用户，保存用户列表
        userlist.push({
            username: data.username,
            socketid: socket.id
        });
        // console.log(userlist);
        // 广播消息（包括自己）
        io.sockets.emit('broadcast message all', userlist);
    })



    // 用户断开连接时的操作
    socket.on('disconnect', function () {
        userlist.forEach((item, index) => {
            if (item.socketid === socket.id) {
                // 断开链接后删除
                userlist.splice(index, index + 1);
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
    socket.on("send private message", function (data) {
        // 对方
        let peer = data.to;
        console.log(data);
        let message = {
            sender: data.from,
            time: data.time,
            message: data.message,
            picture: data.picture
        }
        // 标志
        let belong1 = data.from + '&' + data.to;
        let belong2 = data.to + '&' + data.from;
        let messageList = [];
        // 判断数据集合1是否已存在
        Message.find({
            belong: belong1
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            // 不存在
            if (result.length == 0) {
                // 判断是否存在另一个数据集合2
                Message.find({
                    belong: belong2
                }, function (err, re) {
                    if (err) {
                        console.log(err)
                    }
                    // 都不存在 创建数据库
                    if (re.length == 0) {
                        // 添加到数据库 
                        let messageData1 = new Message({
                            belong: belong2,
                            historyMessage: [message]
                        });
                        // 保存到数据库
                        messageData1.save((err, res) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                    // 已有数据集合2
                    else {
                        messageList = re[0].historyMessage;
                        messageList.push(message);
                        console.log('---消息列表--');
                        console.log(result[0]);
                        console.log(messageList);
                        // 消息插入数据库
                        Message.update({
                            belong:belong2
                        }, {
                            historyMessage: messageList
                        }, function (err, re) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                })
            }
            // 如果已存在数据库1
            else {
                messageList = result[0].historyMessage;
                messageList.push(message);
                // 消息插入数据库
                Message.update({
                    belong:belong1
                }, {
                    historyMessage: messageList
                }, function (err, re) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
        // 发送信息给对应用户
        socket.to(data.socketid).emit('receive private meassge', message);
    })
});