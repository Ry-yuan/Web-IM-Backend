let User = require('../module/user');
let userAction = {
    // 判断是否注册过
    isRegister:function(data){
        User.find({username:data.username},(err,result)=>{
            if(err){
                console.log(err);
                return true;
            }
            if(result.length == 0 ){
                return false;
            }
            else {return true;}
        });
    },
    // 保存用户
    saved : function(data){
             // 创建对象
            let user =new User({
                username : data.username,
                password : data.password
            });
            // 保存到数据库
            user.save((err,res)=>{
                if(err){
                    console.log(err);
                }
                else {
                    return true;
                }
            })
    }
}

module.exports = userAction;