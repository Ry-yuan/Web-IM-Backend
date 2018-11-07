const Message = require('../module/message.js');
module.exports = (io) => {
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
        sex: data.sex,
        status: 1
      });
      // 广播消息（包括自己）
      io.sockets.emit('broadcast message all', userlist);
    })

    // 用户断开连接时的操作
    socket.on('disconnect', function () {
      userlist.forEach((item, index) => {
        if (item.socketid === socket.id) {
          // 断开链接后删除
          userlist.splice(index, 1);
        }
      });
      // 广播消息（包括自己）
      io.sockets.emit('broadcast message all', userlist);
    });

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
      deleteMsgDate(data, data.from, data.to);
      deleteMsgDate(data, data.to, data.from);
      // 发送信息给对应用户
      socket.to(data.socketid).emit('recall message', data);
    });

    // 监听修改消息
    socket.on('modify message', function (data) {
      console.log('修改');
      console.log(data);
      //从数据库删除
      modifyMsgDate(data, data.from, data.to);
      modifyMsgDate(data, data.to, data.from);
      // 发送信息给对应用户
      socket.to(data.socketid).emit('modify message', data);
    });
  });

  // 修改数据
  function modifyMsgDate(data, username, peer) {
    console.log('修改数据');
    console.log(data)
    Message.find({
      username: username,
      peer: peer
    }, (err, result) => {
      console.log('xxxx');
      console.log(result[0]);
      if (result.length != 0) {
        // 拿到消息列表
        let msgList = result[0].historyMessage;
        msgList.map(msgitem => {
          if (msgitem.time == data.time) {
            // 修改数据
            msgitem.message = data.message;
          }
          console.log('修改这个消息');
          console.log(msgitem);
        });
        // 放回数据库
        Message.update({
          username: username,
          peer: peer
        }, {
          historyMessage: msgList
        }, (err, re) => {
          if (err) {
            console.log(err);
          }
          console.log('修改后插入数据库成功');
        });
      }
    })
  }

  // 删除数据
  function deleteMsgDate(data, username, peer) {
    console.log(data);
    Message.update({
      username: username,
      peer: peer
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
}