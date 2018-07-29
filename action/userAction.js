let User = require('../module/user');
const crypto = require('crypto');
let userAction = {
    // 保存用户
    saved : function(data){
            // 加密密码
            let cryptPassword = crypto.createHash('md5').update(data.password).digest('hex');
             // 创建对象
            let user =new User({
                username : data.username,
                password : cryptPassword,
                sex:data.sex
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