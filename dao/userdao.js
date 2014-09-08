var User = require('../models/user'); 
var	util = require('../lib/util');  

//用用户名字去拿用户信息
var getUserInfoByName = function(name,cb){
	User.findOne({name:name},cb);
}

//用用户id去拿用户信息
var getUserInfoByUid = function(uid,cb){
	User.findOne({uid:uid},cb);
}

//用用户email去拿用户信息
var getUserInfoByEmail = function(email,cb){
	User.findOne({email:email},cb);
}

//得到新增用户的uid
var getNextUidOfUser = function(cb){
	var uid = 1;
	User.findOne().sort({'uid':-1}).exec(function(err,doc){  
		if(doc){
			if(doc.uid > 0){
				uid = doc.uid + 1; 
			}
			return cb(null,uid)
		} 
		return cb(err)
	});
}

//得到用户数量
var getNumberOfAllUser = function(cb){
 	User.count({},cb);
}

var getUserListByScore = function(list_hot_user_size,cb){
	User.find().limit(list_hot_user_size).sort({score:-1}).exec(cb);
}
//添加用户信息
var saveNewUser = function(uid,name,email,pwd,relapath,relapath,cb){
	var user = new User({   
		uid:uid,
		name:name, 
		email:email,
		pwd:util.md5_str(pwd),
		originphoto:relapath,
		photo:relapath
	}); 
	user.save(cb);  
}

//更新用户信息By User
var updateUserInfoFree = function(condition,update,options,cb){ 
	User.update(condition,update,options,cb); 
}

//更新用户信息By User
var updateUserInfo = function(user,cb){ 
	user.save(cb);
}

exports.getUserInfoByName = getUserInfoByName;
exports.getUserInfoByUid = getUserInfoByUid;
exports.getUserInfoByEmail = getUserInfoByEmail;
exports.getNextUidOfUser = getNextUidOfUser;
exports.saveNewUser = saveNewUser;
exports.updateUserInfo = updateUserInfo;
exports.updateUserInfoFree = updateUserInfoFree;
exports.getNumberOfAllUser = getNumberOfAllUser;
exports.getUserListByScore = getUserListByScore;
