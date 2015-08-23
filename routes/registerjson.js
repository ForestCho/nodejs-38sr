var	UserDao = require('../dao/userdao');  
var fs = require('fs');
var UPYun = require('../lib/upyun').UPYun;
var path = require('path');
var config = require('../config').config;
var sanitize = require('validator'); 

 exports.doregister = function (req, res) {
 	var name = sanitize.trim(req.body.uname);
 	var email = sanitize.trim(req.body.email);
 	var pwd = sanitize.trim(req.body.pwd);
 	var pwdagain = req.body.pwdagain; 
 	var msg = {};
 	if(name === '' || email === '' || pwd === ''){ 
 		msg.content = "ｏ（╯□╰）ｏ信息不能为空";
 		msg.status = 0;
 		res.json(msg);
 		return ;
 	}

 	if(pwd !== pwdagain){ 
 		msg.content = "ｏ（╯□╰）ｏ两次密码输入不一致";
 		msg.status = 0;
 		res.json(msg);
 		return ;
 	}

 	UserDao.getUserInfoByEmail(email,function(err,tempuser){
 		if(err){
 			msg.content = "服务器未知错误";
 			msg.status = 0;
 			res.json(msg);
 			return ;
 		} 
 		if(tempuser){
 			msg.content = "ｏ（╯□╰）ｏ您输入的邮箱已经被注册过了";
 			msg.status = 0;
 			res.json(msg);
 			return ;
 		}

 		UserDao.getUserInfoByName(name,function(err,tempuser){
 			if(err){
				msg.content = "服务器未知错误";
				msg.status = 0;
				res.json(msg);
				return ;
 			}
 			if(tempuser){
 				msg.content = "ｏ（╯□╰）ｏ名字已经重复，请重新输入一个优雅的名字";
 				msg.status = 0;
 				res.json(msg);
 				return ;
 			}
 			UserDao.getNextUidOfUser(function(err,uid){
 				if (err){
					msg.content = "服务器未知错误";
					msg.status = 0;
					res.json(msg);
					return ;
		 		};    
				var upyun = new UPYun(config.upyun.bat, config.upyun.opname, config.upyun.oppwd);
 					upyun.mkDir('/photo/'+name+'/', true, function(err, data){
 					var defaultImagePath = config.upyun.photourl+'default.jpg'; 
					UserDao.saveNewUser(uid,name,email,pwd,defaultImagePath,defaultImagePath,function(err){
						if (err) {
							res.redirect('500');
						}
						msg.content = "注册成功,马上登录";
						msg.status = 1;
 					res.json(msg);
					});   
 				});
 			})  
		});
	});
};


 exports.dosinaregister = function (req, res) {
 	var oid = sanitize.trim(req.body.oid);
 	var name = sanitize.trim(req.body.name);
 	var locate = sanitize.trim(req.body.locate); 
 	var photo = sanitize.trim(req.body.photo);  
 	var access_token = sanitize.trim(req.body.access_token); 
 	var signature = sanitize.trim(req.body.signature); 
 	var gender = sanitize.trim(req.body.gender); 
 	var logintype = 1;
 	var msg = {};  
 	if(name === '' ){ 
 		msg.content = "ｏ（╯□╰）ｏ用户名不能为空";
 		msg.status = 0;
 		res.json(msg);
 		return ;
 	} 

	 UserDao.getUserInfoByLoginTypeAndAccessToken(logintype,access_token,function(err,tempuser){
 			if(err){
				msg.content = "服务器未知错误";
				msg.status = 0;
				res.json(msg);
				return ;
 			}			
			UserDao.getNextUidOfUser(function(err,uid){
						if (err){
							msg.content = "服务器未知错误";
							msg.status = 0;
							res.json(msg);
							return ;
						};   
						
 			if(tempuser){
					msg.content = "登录成功";
					msg.name = name;
					msg.uid = uid-1;
					msg.photo = photo;
					msg.logintype = logintype; 
					msg.accesstoken = access_token; 
					msg.status = 1;
					res.json(msg);
					return ;
 			}
			UserDao.saveNewSinaUser(uid,name,locate,photo,access_token,logintype,gender,signature,oid,function(err){
					if (err) {
						res.redirect('500');
					}
					msg.content = "注册成功,马上登录";
					msg.name = name;
					msg.uid = uid;
					msg.photo = photo;
					msg.logintype = logintype; 
					msg.accesstoken = access_token; 
					msg.status = 1;
				res.json(msg);
				});   
			});
	});
};

exports.doqqregister = function (req, res) { 
 	var name = sanitize.trim(req.body.name);
 	var locate = sanitize.trim(req.body.locate); 
 	var photo = sanitize.trim(req.body.photo);   
 	var gender = sanitize.trim(req.body.gender); 
 	var logintype = 2;
 	var msg = {};  
 	if(name === '' ){ 
 		msg.content = "ｏ（╯□╰）ｏ用户名不能为空";
 		msg.status = 0;
 		res.json(msg);
 		return ;
 	} 

	 UserDao.getUserInfoByLoginTypeAndName(logintype,name,function(err,tempuser){
 			if(err){
				msg.content = "服务器未知错误";
				msg.status = 0;
				res.json(msg);
				return ;
 			}			
			UserDao.getNextUidOfUser(function(err,uid){
						if (err){
							msg.content = "服务器未知错误";
							msg.status = 0;
							res.json(msg);
							return ;
						};   
						
 			if(tempuser){
					msg.content = "登录成功";
					msg.name = name;
					msg.uid = uid-1;
					msg.photo = photo;
					msg.logintype = logintype;  
					msg.status = 1;
					res.json(msg);
					return ;
 			}
			UserDao.saveNewQQUser(uid,name,locate,photo,logintype,gender,function(err){
					if (err) {
						res.redirect('500');
					}
					msg.content = "注册成功,马上登录";
					msg.name = name;
					msg.uid = uid;
					msg.photo = photo;
					msg.logintype = logintype;  
					msg.status = 1;
				res.json(msg);
				});   
			});
	});
};