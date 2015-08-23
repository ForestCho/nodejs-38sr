var	UserDao = require('../dao/userdao'); 
var	nodemailer = require('nodemailer'); 
var	util = require('../lib/util'); 
var	EventProxy = require('eventproxy');
/*
 * GET find password page.
 */

 exports.get = function (req, res) { 
 	res.render('forgetpwd', { title: '找回密码' }); 
 }; 

 exports.sendmail = function (req, res) {
 	var usermail = req.body.email;
 	var randomPwd =util.random_string(12);
 	var msg = {}
 	var ep = new EventProxy();

 	ep.assign("tempuser","raw",function(tempuser,raw){
 		var emailTitle = "38锶找回密码";
 		var htmlContent ="您的帐号"+uname+"在38锶的密码为"+randomPwd+",热泪欢迎你啊…";
 		util.send_mail(usermail,emailTitle,htmlContent,function(error,response){ 		 
	 		msg.content = "密码已经发送到您的邮箱!!" ;
	 		msg.status = 1 ;
 			res.render('forgetpwd', { title: '找回密码',msg:msg });
 		}); 
 	});

 	UserDao.getUserInfoByEmail(usermail,function (error,tempuser) {
 		if(tempuser){
 			ep.emit("tempuser",tempuser);
 		}else{ 
 			msg.content = "请输入注册时的邮箱!!" ;
	 		msg.status = 0 ;
 			res.render('forgetpwd', { title: '找回密码',msg:msg });
 		}
 	}); 
 	var condition = {email: usermail};
 	var update = { pwd: util.md5_str(randomPwd) };
 	var options = { multi: false };
 	UserDao.updateUserInfoFree(condition, update, options, function (err, numberAffected, raw) {  
 		if (err){
			res.redirect('/500');
			return ; 			
 		}
 		ep.emit("raw",raw)
 	}); 
 }; 
