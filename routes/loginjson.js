var	util = require('../lib/util'); 
var	MessageDao = require('../dao/messagedao'); 
var	UserDao = require('../dao/userdao'); 
var	EventProxy = require('eventproxy'); 
var sanitize = require('validator');
var config = require('../config').config;


 exports.dologin = function (req, res) {
 	var name = sanitize.trim(req.body.uname);
 	var pwd = sanitize.trim(req.body.pwd); 
 	var remember = req.body.remember;
 	var id = 1;
 	var md5pwd =util.md5_str(pwd);
	var msg ={};
 	var ep = new EventProxy(); 

 	if(name.length === 0){
 		msg.content = "账户不能为空，ｏ（╯□╰）ｏ!!" ;
 		msg.status = 0 ; 
 		res.json(msg);
 		return ;
 	}
 	if(pwd.length === 0){
 		msg.content = "密码不能为空，ｏ（╯□╰）ｏ!!" ;
 		msg.status = 0 ; 
 		res.json(msg);
 		return ;
 	} 

 	UserDao.getUserInfoByName(name,function(err,tempuser){
 		if(err){ 				
	 		msg.content = "未知错误!!" ;
	 		msg.status = 0 ; 
			res.json(msg);
	 		return ;		
 		}
 		if(!tempuser){ 			
	 		msg.content = "账号不存在!!" ;
	 		msg.status = 0 ; 
 			res.json(msg);
	 		return ;
 		} 
 		if(md5pwd != tempuser.pwd){
	 		msg.content = "密码不正确!!" ;
	 		msg.status = 0 ; 
 			res.json(msg);
	 		return ;
 		}
		console.log(tempuser);
		msg.userinfo = tempuser;
		msg.content = name ;
		msg.status = 1 ;  
 		res.json(msg);
 	})  	 
 };
 