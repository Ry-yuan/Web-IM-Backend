let User = require('./module/user.js');
let UserAction = require('./action/userAction');
let Message = require('./module/message.js');
let Router = (app)=>{
    // 路由
    app.get('/',function(req,res){
        // res.sendFile(__dirname +　"/index.html");
        res.json({uid:123});
    });

    // 注册接口
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

    // 登录接口
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
                console.log(result);
                if(result[0].password == data.password){
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


    app.get('/chat',(req,res)=>{
        // 获取保存在cookie中的sid
        let sid = req.cookies.sid;
        let user = req.session[sid]
        // 查找用户资料
        User.find({username:user},(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                res.json({code:0,data:{username:result[0].username,password:result[0].password},msg:'success'});
            }
        });
    });


    // 获取历史消息
    app.get('/gethistory',(req,res)=>{
        console.log(req.query);
        let user = req.query.username;
        let peer = req.query.peer;
        let message = [];
        // console.log('---------');
        // console.log(user);
        Message.find({username:user},(err,result)=>{
            console.log('--------ss');
            console.log(peer);
            if(err){
                console.log(err);
            }
            // console.log(result);
            if(result.length !=0){
                console.log(result[0]);
                if(result[0].peer == peer){
                    // result[0].historyMessage.forEach(element => {
                    //         console.log(element.messageArr);
                    //         message = element.messageArr;
                        
                    // });
                    message = result[0].historyMessage;
                }
                console.log('-----');
                console.log(message);
                res.json({code:0,data:message,msg:'success'});
            }
        })
    })



    // 测试保存message数据
    // 创建对象
    // let message =new Message({
    //     username:'lala',
    //     historyMessage: [{
    //         peer:'yy',
    //         messageArr:[{
    //             sender:'ry',
    //             time:'2017.10',
    //             message:'hello'
    //         }]
    //     }],
    // });
    // 保存到数据库
    // message.save((err,res)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     else {
    //         return true;
    //     }
    // })

    // 查询
    // Message.find({username:'lala'},(err,result)=>{
    //     if(!!result){
    //         console.log(result[0]);
            
    //         result[0].historyMessage.forEach(element => {
    //             if(element.peer == 'yy'){
    //                 console.log(element.message);
    //             }
    //         });
    //     }
    // })
}
module.exports = Router;