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
// app.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Credentials','true');
//     next()
//   })
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
// var removeString = {
//     'username': 'ee'
// }

// User.remove(removeString, function (err, res) {
//     if (err) {
//         console.log(err);
//     }
// })
/**
 * 条件查询
 * Model.find(conditions, [fields], [options], [callback])
 */
// var whereString = {
//     'age': '12'
// }
// User.find(whereString, function (err, res) {
//     if (err) {
//         console.log(err);
//     };
// })





// 修改
// Message.find({
//     username:'ryyuan',
//     peer:'yyyyyy',
// },(err,result)=>{
//     console.log('测试查找修改');
//     let re = result[0].historyMessage;
//     // console.log(result[0].historyMessage);
//     re.map(item=>{
//         if(item.time == '1532766804274'){
//             console.log(item);
//             item.message = 'modify';
//         }
//     });
//     // 插入数据库
//     Message.update({username:'ryyuan',peer:'yyyyyy'},{historyMessage:re},function(err,result){
//         console.log('插入');
//         console.log(result);
//     })
// })
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
            socketid: socket.id,
            sex:data.sex,
            status:1
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
        let username = data.from;
        // 对方
        let peer = data.to;
        console.log(data);
        let message = {
            sender: data.from,
            time: data.time,
            message: data.message,
            picture: data.picture
        }


        // 保存数据
        saveData(username, peer, message);
        saveData(peer, username, message);
        // 发送信息给对应用户
        socket.to(data.socketid).emit('receive private meassge', message);
    })

    // 监听撤回消息
    socket.on('recall message', function (data) {
        console.log('撤回');
        console.log(data);
        //从数据库删除
        deleteMsgDate(data,data.from,data.to);
        deleteMsgDate(data,data.to,data.from);
        // 发送信息给对应用户
        socket.to(data.socketid).emit('recall message', data);
    });

    // 监听修改消息
    socket.on('modify message', function (data) {
        console.log('修改');
        console.log(data);
        //从数据库删除
        modifyMsgDate(data,data.from,data.to);
        modifyMsgDate(data,data.to,data.from);
        // 发送信息给对应用户
        socket.to(data.socketid).emit('modify message', data);
    });
});
// 修改数据
function modifyMsgDate(data,username,peer){
    console.log('修改数据');
    console.log(data)
    Message.find({
        username:username,
        peer:peer
    },(err,result)=>{
        console.log('xxxx');
        console.log(result[0]);
        if(result.length != 0){
             // 拿到消息列表
        let msgList = result[0].historyMessage;
        msgList.map(msgitem=>{
            if(msgitem.time == data.time){
                // 修改数据
                msgitem.message = data.message;
            }
            console.log('修改这个消息');
            console.log(msgitem);
        });
        // 放回数据库
        Message.update({
            username:username,
            peer:peer       
        },{historyMessage:msgList},(err,re)=>{
            if(err){
                console.log(err);
            }
            console.log('修改后插入数据库成功');
        });
        }
    })
}

// 删除数据
function deleteMsgDate(data,username,peer) {
    console.log(data);
    Message.update({
        username: username,
        peer:peer
    }, {
        '$pull': {
            historyMessage: {
                time: data.time
            }
        }
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
        console.log(data);
    });
}

// 保存数据
function saveData(user1, user2, message) {
    let messageList = [];
    // 判断数据集合是否已存在
    Message.find({
        username: user1,
        peer: user2
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        // 不存在
        if (result.length == 0) {
            let messageData1 = new Message({
                username: user1,
                peer: user2,
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
            messageList = result[0].historyMessage;
            messageList.push(message);
            console.log('---消息列表--');
            console.log(result[0]);
            console.log(messageList);
            // 消息插入数据库
            Message.update({
                username: user1,
                peer: user2
            }, {
                historyMessage: messageList
            }, function (err, re) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });


    
}