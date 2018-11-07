const User = require('../../module/user.js');
const crypto = require('crypto');
module.exports = {
  register: (req, res) => {
    // 获得数据
    let data = req.body;
    User.find({
      username: data.username
    }, (err, result) => {
      if (err) {
        console.log(err);
      }
      // 如果没注册
      if (result.length == 0) {
        // 加密密码
        let cryptPassword = crypto.createHash('md5').update(data.password).digest('hex');
        // 创建对象
        let user = new User({
          username: data.username,
          password: cryptPassword,
          sex: data.sex
        });
        // 保存到数据库
        user.save((err, res) => {
          if (err) {
            console.log(err);
          } else {
            return true;
          }
        });
        res.json({
          code: 0,
          data: {},
          msg: 'success'
        });
      }
      // 如果注册了返回信息
      else {
        res.json({
          code: 1001,
          data: {},
          msg: '用户已注册'
        });
      }
    });
  },

  login: (req, res) => {
    // 获得数据
    let data = req.body;
    // 查找用户
    User.find({
      username: data.username
    }, (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          code: 1002,
          data: {},
          msg: '报错'
        });
      }
      // 存在账号
      if (result.length !== 0) {
        // 判断密码是否相同
        let cryptPassword = crypto.createHash('md5').update(data.password).digest('hex');
        console.log(result);
        if (result[0].password == cryptPassword) {
          let sid = req.session.id;
          // 发送cookies 来识别已登陆
          res.cookie('sid', req.session.id);
          // 关联sid 和 username
          req.session[sid] = data.username;
          console.log(req.session[sid]);
          res.json({
            code: 0,
            data: {},
            msg: 'success'
          });
        } else {
          res.json({
            code: 1002,
            data: {},
            msg: '密码错误'
          });
        }
      }
      // 不存在
      else {
        res.json({
          code: 1003,
          data: {},
          msg: '无此账号'
        });
      }
    })
  },

  logout: (req, res) => {
    console.log(req.cookies.sid);
    console.log(req.body);
    console.log('注销');
    // console.log(req.cookies.sid);
    let sid = req.cookies.sid;
    req.session[sid] = null;
    console.log(req.session[sid]);
    res.json({
      code: 0,
      data: {},
      msg: 'success'
    });
  }
}