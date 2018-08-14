let User = require('./module/user.js');
let UserAction = require('./action/userAction');
let Message = require('./module/message.js');
const crypto = require('crypto');
let Router = (app)=>{
   
    // 路由
    app.get('/',function(req,res){
        // res.sendFile(__dirname +　"/index.html");
        res.json({uid:123});
    });

    // 1 注册接口
    app.post('/userregister', (req,res)=>{
        // 获得数据
        let data = req.body;
        User.find({username:data.username},(err,result)=>{
            if(err){
                console.log(err);
            }
            // 如果没注册
            if(result.length == 0 ){
                UserAction.saved(data);
                res.json({code:0,data:{},msg:'success'});
            }
            // 如果注册了返回信息
            else {
                res.json({code:1001,data:{},msg:'用户已注册'});
            }
        });
    })

    // 2 登录接口
    app.post('/userlogin',(req,res)=>{
        // 获得数据
        let data = req.body;

        // 查找用户
        User.find({username:data.username},(err,result)=>{
            if(err){
                console.log(err);
                res.json({code:1002,data:{},msg:'报错'});
            }
            // 存在账号
            if(result.length !== 0 ){
                // 判断密码是否相同
                let cryptPassword = crypto.createHash('md5').update(data.password).digest('hex');                
                console.log(result);
                if(result[0].password == cryptPassword){
                    let sid = req.session.id;
                    // 发送cookies 来识别已登陆
                    res.cookie('sid',req.session.id);
                    
                    // 关联sid 和 username
                    req.session[sid]  = data.username;
                    console.log(req.session[sid]);
                    res.json({code:0,data:{},msg:'success'});
                }
                else{
                    res.json({code:1002,data:{},msg:'密码错误'});
                }
            }
            // 不存在
            else{
                res.json({code:1003,data:{},msg:'无此账号'});
            }
        })
    })

    // 3 注销接口
    app.post('/logout',(req,res)=>{
        console.log(req.cookies.sid);
        console.log(req.body);
        console.log('注销');
        // console.log(req.cookies.sid);
        let sid = req.cookies.sid;
        req.session[sid] = null;
        console.log(req.session[sid]);
        res.json({code:0,data:{},msg:'success'});
    });


    // 4 聊天接口
    app.get('/chat',(req,res)=>{
        console.log('session----------------');
        console.log(req.session);
        // 获取保存在cookie中的sid
        let sid = req.cookies.sid;
        let user = req.session[sid];
        // 如果没有用户 返回
        if(user == null || user == undefined){
            res.json({code:1,data:{},msg:'nologin'});
            return;
        }
        // 查找用户资料
        User.find({username:user},(err,result)=>{
            if(err){
                console.log(err);
            }
            else if(result.length!=0){
                res.json({code:0,data:{username:result[0].username,sex:result[0].sex},msg:'success'});
            }
        });
    });


    // 5 获取历史消息
    app.get('/gethistory',(req,res)=>{
        console.log(req.query);
        let user = req.query.username;
        let peer = req.query.peer;
        let message = [];
        Message.find({username:user,peer:peer},(err,result)=>{
            console.log('---请求历史数据1-----');
            console.log(user);
            if(err){
                console.log(err);
            }
            // 有数据
            if(result.length !=0){
                console.log('---有数据返回1---')
                console.log(result[0]);
                message = result[0].historyMessage;
                console.log(message);
                res.json({code:0,data:message,msg:'success'});
            }
            else{
                console.log('没有数据');
                res.json({code:0,data:{},msg:'no data'});
            }
        })
    })

    // 6 历史用户列表
    app.get('/get_history_userlist',(req,res)=>{
        console.log('请求历史用户');
        console.log(req.query);
        let username = req.query.username;
        // 查找数据库
        Message.find({username:username},'peer',(err,result)=>{
            console.log(result);
            let data = [];
            result.map(item=>{
                // 除去自己
                if(item.peer != username){
                    data.push({username:item.peer});
                }
            })
            console.log(data);
            res.json({code:0,data:data,msg:'success'});
        })
    })
}

module.exports = Router;