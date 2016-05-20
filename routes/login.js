var util = require('../lib/util');
var MessageDao = require('../dao/messagedao');
var UserDao = require('../dao/userdao');
var EventProxy = require('eventproxy');
var sanitize = require('validator');
var config = require('../config').config;

/**
 * [login 登录页面]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.login = function(req, res) {
	var prelink = "/";
	var msg = {};
	if (typeof req.query.prelink != "undefined") {
		prelink = req.query.prelink;
		msg.content = "请先登录!!";
		msg.status = 0;
	}
	msg.status = -1;
	res.render('login', {
		title: '登录',
		prelink: prelink,
		msg: msg
	});
};

/**
 * [dologin 登录动作]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
// exports.dologin = function (req, res) {
// 	var name = sanitize.trim(req.body.uname);
// 	var pwd = sanitize.trim(req.body.pwd);
// 	var prelink = sanitize.trim(req.body.prelink);
// 	var remember = req.body.remember;
// 	var id = 1;
// 	var md5pwd =util.md5_str(pwd);
// var msg ={};
// 	var ep = new EventProxy(); 

// 	if(name.length === 0){
// 		msg.content = "账户不能为空，ｏ（╯□╰）ｏ!!" ;
// 		msg.status = 0 ;
// 		res.render('login', { title: '登录',prelink:prelink,msg:msg });  
// 		return ;
// 	}
// 	if(pwd.length === 0){
// 		msg.content = "密码不能为空，ｏ（╯□╰）ｏ!!" ;
// 		msg.status = 0 ;
// 		res.render('login', { title: '登录',prelink:prelink,msg:msg });  
// 		return ;
// 	}

// 	ep.assign("userinfo",function (userinfo) {
// 		if(remember){
// 			var auth_token = util.encrypt(userinfo.uid + '|' + userinfo.uname,config.session_secret)
// 			res.cookie(config.cookie_name,auth_token,{path:config.cookie_path,maxAge:1000 * 60 * 60 * 24 * 7});
// 		}  
// 		req.session.user = userinfo;
// 		res.locals.userinfo = req.session.user;    
// 		res.redirect(prelink); 
// 	});

// 	UserDao.getUserInfoByName(name,function(err,tempuser){
// 		if(err){
// 				res.redirect('/500');
// 				return ; 			
// 		}
// 		if(!tempuser){ 			
//  		msg.content = "账号不存在!!" ;
//  		msg.status = 0 ;
//  		res.render('login', { title: '登录',prelink:prelink,msg:msg}); 
//  		return ;
// 		} 
// 		if(md5pwd != tempuser.pwd){
//  		msg.content = "密码不正确!!" ;
//  		msg.status = 0 ;
//  		res.render('login', { title: '登录',prelink:prelink,msg:msg}); 
//  		return ;
// 		}
// 	ep.emit("userinfo",tempuser);
// 	})  	 
// };


exports.dologin = function(req, res) {
	var name = sanitize.trim(req.body.uname);
	var pwd = sanitize.trim(req.body.pwd);
	var remember = req.body.remember;
	var md5pwd = util.md5_str(pwd);
	var msg = {};
	var ep = new EventProxy();

	if (name.length === 0) {
		msg.content = "账户不能为空，ｏ（╯□╰）ｏ!!";
		msg.status = 0;
		res.render('login', {
			title: '登录',
			prelink: prelink,
			msg: msg
		});
		return;
	}
	if (pwd.length === 0) {
		msg.content = "密码不能为空，ｏ（╯□╰）ｏ!!";
		msg.status = 0;
		res.render('login', {
			title: '登录',
			prelink: prelink,
			msg: msg
		});
		return;
	}

	ep.assign("userinfo", function(userinfo) {
		if (remember) {
			var auth_token = util.encrypt(userinfo.uid + '|' + userinfo.uname, config.session_secret)
			res.cookie(config.cookie_name, auth_token, {
				path: config.cookie_path,
				maxAge: 1000 * 60 * 60 * 24 * 7
			});
		}
		req.session.user = userinfo;
		msg.status = 1;
		res.json(msg);
		return
	});

	UserDao.getUserInfoByName(name, function(err, tempuser) {
		if (err) {
			res.redirect('/500');
			return;
		}
		if (!tempuser) {
			msg.content = "账号不存在!!";
			msg.status = 0;
			res.json(msg);
			return
		}
		if (md5pwd != tempuser.pwd) {
			msg.content = "密码不正确!!";
			msg.status = 0;
			res.json(msg);
			return
		}
		ep.emit("userinfo", tempuser);
	})
};


/**
 * [user_auth 用户授权
 ]
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.user_auth = function(req, res, next) {
	if (req.session.user) {
		console.log("cccccccc");
		var uid = req.session.user.uid;
		res.locals.userinfo = req.session.user;
		MessageDao.getCountOfMessageByUid(uid, false, function(err, count) {
			if (err) {
				next(err);
			}
			res.locals.userinfo.msgcount = count;
			next();
			return;
		})
	} else {
		var cookie = req.cookies[config.cookie_name];
		if (!cookie) {
			next();
			return;
		}
		var auth_token = util.decrypt(cookie, config.session_secret);
		var auth = auth_token.split('|');
		var uid = auth[0];
		UserDao.getUserInfoByUid(uid, function(err, curruser) {
			if (err) {
				return next(err);
			}
			req.session.user = curruser;
			res.locals.userinfo = curruser;
			MessageDao.getCountOfMessageByUid(uid, false, function(err, count) {
				if (err) {
					next(err);
				}
				res.locals.userinfo.msgcount = count;
				next();
				return;
			})
		});
	}
}