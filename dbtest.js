




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