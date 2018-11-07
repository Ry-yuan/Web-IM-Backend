const userController = require('../controllers/user-controller/userController');
const charController = require('../controllers/chat-controller/charController');
let Router = require('express').Router();

// 1 注册接口
Router.post('/userregister', userController.register);

// 2 登录接口
Router.post('/userlogin', userController.login);

// 3 注销接口
Router.post('/logout', userController.logout);

// 4 聊天接口
Router.get('/chat', charController.userInfo);

// 5 获取历史消息
Router.get('/gethistory', charController.getHistoryMessage);

// 6 历史用户列表
Router.get('/get_history_userlist', charController.getHistoryTalker);

module.exports = Router;