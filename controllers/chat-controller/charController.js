const User = require('../../module/user');
const Message = require('../../module/message.js');

module.exports = {
  userInfo: (req, res) => {
    // console.log('session----------------');
    // console.log(req.session);
    // 获取保存在cookie中的sid
    let sid = req.cookies.sid;
    let user = req.session[sid];
    // 如果没有用户 返回
    if (user == null || user == undefined) {
      res.json({
        code: 1,
        data: {},
        msg: 'nologin'
      });
      return;
    }
    // 查找用户资料
    User.find({
      username: user
    }, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length != 0) {
        res.json({
          code: 0,
          data: {
            username: result[0].username,
            sex: result[0].sex
          },
          msg: 'success'
        });
      }
    });
  },

  getHistoryMessage: (req, res) => {
    console.log(req.query);
    let user = req.query.username;
    let peer = req.query.peer;
    let message = [];
    Message.find({
      username: user,
      peer: peer
    }, (err, result) => {
      // console.log('---请求历史数据1-----');
      // console.log(user);
      if (err) {
        console.log(err);
      }
      // 有数据
      if (result.length != 0) {
        // console.log('---有数据返回1---')
        console.log(result[0]);
        message = result[0].historyMessage;
        console.log(message);
        res.json({
          code: 0,
          data: message,
          msg: 'success'
        });
      } else {
        // console.log('没有数据');
        res.json({
          code: 0,
          data: {},
          msg: 'no data'
        });
      }
    })
  },

  getHistoryTalker: (req, res) => {
    console.log('请求历史用户');
    console.log(req.query);
    let username = req.query.username;
    // 查找数据库
    Message.find({
      username: username
    }, 'peer', (err, result) => {
      console.log(result);
      let data = [];
      result.map(item => {
        // 除去自己
        if (item.peer != username) {
          data.push({
            username: item.peer
          });
        }
      })
      // console.log(data);
      res.json({
        code: 0,
        data: data,
        msg: 'success'
      });
    })
  }
}