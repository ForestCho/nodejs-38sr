var User = require('../models/user'); 
var	UserDao = require('../dao/userdao'); 
var util = require('../lib/util'); 
var EventProxy = require('eventproxy');  

/**
 * [baseDisplay 基本设置页面]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
 var baseDisplay = function (req, res) {
 	var username = req.session.user.name; 
	var msg = {};

 	UserDao.getUserInfoByName(username,function(err,user){
 		if (err){
 			res.redirect('/500')
 			return ;
 		};
 		if(!user){ 
 			res.redirect('/404')
 			return ;
 		} 
 		if(user){
 			req.session.user = user; 
 			var msgtemp = req.flash('msg');  
 			msg.status = -1;	 
 			if(msgtemp.length > 0){
 				msg.content = msgtemp[0].content;
 				msg.status = msgtemp[0].status;
 			}   
 			res.render('baseset', { title: '个人设置',msg:msg });
 		}
 	});	
 };
/*
 * 账户设置页面
 */
 var accountDisplay = function(req, res){  
 	var msg = {};
 	var tempmsg = req.flash('msg'); 
	msg.status = -1;	 
	if(tempmsg.length > 0){ 
		msg.content = tempmsg[0].content;
		msg.status = tempmsg[0].status;
	}  
 	res.render('accountset', { title: '个人设置',msg:msg });
 };
/*
 * 头像设置页面
 */
 var avatarDisplay = function(req, res){
 	var username = req.session.user.name;
	var msg = {};
 	UserDao.getUserInfoByName(username,function(err,userinfo){ 
 		if (err){
 			res.redirect('/500')
 			return ;
 		};
 		if(!userinfo){ 
 			res.redirect('/404')
 			return ;
 		}
 		req.session.user = userinfo; 
 		var tempmsg = req.flash('msg'); 
		msg.status = -1;	 
 		if(tempmsg.length > 0){ 
 			msg.content = tempmsg[0].content;
 			msg.status = tempmsg[0].status;
 		}   
 		res.render('avatarset', { title: '个人设置',msg:msg }) 
 	});	 
 };
 
/*
 * 基本设置页面动作
 */
 var doSetBaseInfo = function(req, res){
 	var email = req.body.email;
 	var signature = req.body.signature;
 	var intro = req.body.introduction;
 	var username = req.session.user.name;
 	var msg = {};

 	var ep = new EventProxy();

 	ep.assign('msg',function(msg){ 
 		req.flash('msg',msg); 
 		res.redirect('/set'); 
 	});
 	if(signature.length > 30){
 		msg.content = "签名多过30个字符";
 		msg.status = 0; 
 		ep.emit("msg",msg);
 		return ;
 	}
 	if(intro.length > 300){
 		msg.content = "自我介绍多过300个字符";
 		msg.status = 0;
 		ep.emit("msg",msg);
 		return ;
 	}
 	var condition = {
 		name:username
 	},
 	update = {$set:{email:email,signature:signature,intro:intro}},
 	options = {multi: false};

 	UserDao.updateUserInfoFree(condition,update,options,function(err,num){
 		if (err){
 			res.redirect('/500')
 			return ;
 		};   
 		if(num ==1 ){	
 			req.session.user.email = email;
 			req.session.user.signature = signature;
 			req.session.user.intro = intro;
 			msg.content = "信息修改成功!!" ;
 			msg.status = 1;
 			ep.emit("msg",msg);
 			return ; 
 		}

 	}); 
 };
/*
 * 账户设置动作
 */
 var adoSetccountInfo = function(req, res){
 	var oldpwd = req.body.oldpwd;
 	var	newpwd = req.body.newpwd;
 	var	newpwdagain = req.body.newpwdagain;
 	var	name = req.session.user.name;
 	var	md5pwd = util.md5_str(oldpwd);
 	var msg = {};
 	var ep = new EventProxy();
 	
 	ep.assign('msg',function(msg){
 		res.render('accountset', { title: '个人设置',msg:msg }); 
 	});

 	if(newpwd !== newpwdagain){ 
 		msg.content = "两次输入密码不相同!!";  
 		msg.status = 0;
 		ep.emit('msg',msg);
 		return ;
 	}
 	UserDao.getUserInfoByName(name,function(err,tempuser){ 
 		if (err){
 			res.redirect('/500')
 			return ;
 		}  
 		if(md5pwd !== tempuser.pwd){ 
 			msg.content = "原密码不正确!!"; 
 			msg.status = 0;
 			ep.emit('msg',msg);
 			return ;
 		}
 		var condition = {name:name};
 		var	update = {$set:{pwd:util.md5_str(newpwd)}};
 		var	options = {multi: false};
 		UserDao.updateUserInfoFree(condition,update,options,function(err,num){ 
 			if (err){
 				res.redirect('/404')
 				return ;
 			}   
 			if(num === 1 ){ 
	 			msg.content = "修改成功!!"; 
	 			msg.status = 1;
 				ep.emit('msg',msg);
 				return ;
 			}
 		}); 	 
 	}); 
 };
 

 exports.baseDisplay = baseDisplay;
 exports.accountDisplay = accountDisplay;
 exports.avatarDisplay = avatarDisplay;
 exports.doSetBaseInfo = doSetBaseInfo;
 exports.adoSetccountInfo = adoSetccountInfo;
