var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/',function(req,res){
    res.sendFile(__dirname +　"/index.html")
});

// 数组存储登录的用户
var userlist = [];

// 事件：当有用户连接触发
io.on('connection',function(socket){
    // 增加一个用户，保存用户列表
    userlist.push({
        user:'user'+socket.id,
        socketid:socket.id
    });

    console.log(userlist);
    // 用户断开连接时的操作
    socket.on('disconnect', function(){
        userlist.forEach((item,index)=>{
            if(item.socketid === socket.id){
                // 断开链接后删除
                userlist.splice(index,index+1);
            }
            console.log(userlist);
        });
    });

    // 每个连接都有一个socket.id
    // console.log(socket.id);

    // 定义news，仅仅发送给自己
    // socket.emit('news',{hello:'ry'});

    // 接受来自my other event的消息
    socket.on('my other event',function(data){
        // 发送消息
        socket.emit('message',data);
    });

    // 广播消息（包括自己）
    io.sockets.emit('broadcast message all', userlist);
    
});
