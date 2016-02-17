var User = require('../models/user'); 
var	util = require('../lib/util');  


/**
 * [getUserInfoByName 用用户名字去拿用户信息]
 * @param  {[type]}   name
 * @param  {Function} cb
 * @return {[type]}
 */
var getUserInfoByName = function(name,cb){
	User.findOne({name:name},cb);
}

/**
 * [getAdminUserInfoByName description]
 * @param  {[type]}   name
 * @param  {Function} cb
 * @return {[type]}
 */
var getAdminUserInfoByName = function(name,cb){
	User.findOne({name:name,admin:1},cb);
}

/**
 * [getUserInfoByUid 用用户id去拿用户信息]
 * @param  {[type]}   uid
 * @param  {Function} cb
 * @return {[type]}
 */
var getUserInfoByUid = function(uid,cb){
	User.findOne({uid:uid},cb);
}
 
/**
 * [getUserInfoByEmail 用用户email去拿用户信息]
 * @param  {[type]}   email
 * @param  {Function} cb
 * @return {[type]}
 */
var getUserInfoByEmail = function(email,cb){
	User.findOne({email:email},cb);
}

/**
 * [getUserInfoByObj description]
 * @param  {[type]}   obj
 * @param  {Function} cb
 * @return {[type]}
 */
var getUserInfoByObj = function(obj,cb){
	User.findOne(obj,cb);
}

/**
 * [getUserInfoByLoginTypeAndAccessToken description]
 * @param  {[type]}   logintype
 * @param  {[type]}   access_token
 * @param  {Function} cb
 * @return {[type]}
 */
var getUserInfoByLoginTypeAndAccessToken = function(logintype,access_token,cb){
	User.findOne({logintype:logintype,access_token:access_token},cb);
}

/**
 * [getUserInfoByLoginTypeAndName description]
 * @param  {[type]}   logintype
 * @param  {[type]}   name
 * @param  {Function} cb
 * @return {[type]}
 */
var getUserInfoByLoginTypeAndName = function(logintype,name,cb){
	User.findOne({logintype:logintype,name:name},cb);
}
 
/**
 * [getNextUidOfUser 得到新增用户的uid]
 * @param  {Function} cb
 * @return {[type]}
 */
var getNextUidOfUser = function(cb){
	var uid = 1;
	User.findOne().sort({'uid':-1}).exec(function(err,doc){  
		if(!err){
			if(doc){
				if(doc.uid > 0){
					uid = doc.uid + 1; 
				}
			} 
			return cb(null,uid)
		}
		return cb(err); 
	});
}
 
/**
 * [getNumberOfAllUser 得到用户数量]
 * @param  {Function} cb
 * @return {[type]}
 */
var getNumberOfAllUser = function(cb){
 	User.count({},cb);
}

/**
 * [getUserListByScore description]
 * @param  {[type]}   list_hot_user_size
 * @param  {Function} cb
 * @return {[type]}
 */
var getUserListByScore = function(list_hot_user_size,cb){
	User.find().limit(list_hot_user_size).sort({score:-1}).exec(cb);
}

/**
 * [saveNewUser 添加用户信息]
 * @param  {[type]}   uid
 * @param  {[type]}   name
 * @param  {[type]}   email
 * @param  {[type]}   pwd
 * @param  {[type]}   relapath
 * @param  {[type]}   relapath
 * @param  {Function} cb
 * @return {[type]}
 */
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

/**
 * [saveNewUserObject 添加用户信息]
 * @param  {[type]}   userobj
 * @param  {Function} cb
 * @return {[type]}
 */
var saveNewUserObject = function(userobj,cb){
	userobj.save(cb);  
}

/**
 * [saveNewSinaUser 保存注册为SINA用户]
 * @param  {[type]}   uid
 * @param  {[type]}   name
 * @param  {[type]}   locate
 * @param  {[type]}   photo
 * @param  {[type]}   access_token
 * @param  {[type]}   logintype
 * @param  {[type]}   gender
 * @param  {[type]}   signature
 * @param  {[type]}   oid
 * @param  {Function} cb
 * @return {[type]}
 */
var saveNewSinaUser = function(uid,name,locate,photo,access_token,logintype,gender,signature,oid,cb){
	var user = new User({   
		uid:uid,
		name:name, 
		locate:locate,
		photo:photo,
		access_token:access_token,
		logintype:logintype,
		gender:gender,
		signature:signature,
		oid:oid
	}); 
	user.save(cb);  
}

/**
 * [saveNewQQUser 保存注册为QQ用户]
 * @param  {[type]}   uid
 * @param  {[type]}   name
 * @param  {[type]}   locate
 * @param  {[type]}   photo
 * @param  {[type]}   logintype
 * @param  {[type]}   gender
 * @param  {Function} cb
 * @return {[type]}
 */
var saveNewQQUser = function(uid,name,locate,photo,logintype,gender,cb){
	var user = new User({   
		uid:uid,
		name:name, 
		locate:locate,
		photo:photo, 
		logintype:logintype,
		gender:gender
	}); 
	user.save(cb);  
}


/**
 * [updateUserInfoFree 更新用户信息By User]
 * @param  {[type]}   condition
 * @param  {[type]}   update
 * @param  {[type]}   options
 * @param  {Function} cb
 * @return {[type]}
 */
var updateUserInfoFree = function(condition,update,options,cb){ 
	User.update(condition,update,options,cb); 
}
 
/**
 * [updateUserInfo 更新用户信息By User]
 * @param  {[type]}   user
 * @param  {Function} cb
 * @return {[type]}
 */
var updateUserInfo = function(user,cb){ 
	user.save(cb);
}

exports.getUserInfoByName = getUserInfoByName;
exports.getAdminUserInfoByName = getAdminUserInfoByName;
exports.getUserInfoByUid = getUserInfoByUid;
exports.getUserInfoByEmail = getUserInfoByEmail;

exports.getUserInfoByLoginTypeAndAccessToken = getUserInfoByLoginTypeAndAccessToken;
exports.getUserInfoByLoginTypeAndName = getUserInfoByLoginTypeAndName;


exports.getNextUidOfUser = getNextUidOfUser;
exports.saveNewUser = saveNewUser;
exports.saveNewUserObject = saveNewUserObject;
exports.saveNewSinaUser = saveNewSinaUser;
exports.saveNewQQUser = saveNewQQUser;
exports.updateUserInfo = updateUserInfo;
exports.updateUserInfoFree = updateUserInfoFree;
exports.getNumberOfAllUser = getNumberOfAllUser;
exports.getUserListByScore = getUserListByScore;

exports.getUserInfoByObj = getUserInfoByObj;
