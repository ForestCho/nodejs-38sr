var	UserDao = require('../dao/userdao');  
var fs = require('fs');
var path = require('path');
var config = require('../config').config;
var sanitize = require('validator');
/*
 * GET register page.
 */

 exports.reg = function (req, res) {
 	res.render('register', { title: '注册' });
 };

 exports.doreg = function (req, res) {
 	var name = sanitize.trim(req.body.uname);
 	var email = sanitize.trim(req.body.email);
 	var pwd = sanitize.trim(req.body.pwd);
 	var pwdagain = req.body.pwdagain; 
 	var msg = {};
 	if(name === '' || email === '' || pwd === ''){ 
 		msg.content = "ｏ（╯□╰）ｏ信息不能为空";
 		msg.status = 0;
 		res.render('register', { title: '注册',msg:msg });
 		return ;
 	}

 	if(pwd !== pwdagain){ 
 		msg.content = "ｏ（╯□╰）ｏ两次密码输入不一致";
 		msg.status = 0;
 		res.render('register', { title: '注册',msg:msg });
 		return ;
 	}

 	UserDao.getUserInfoByEmail(email,function(err,tempuser){
 		if(err){
 			res.redirect('/500');
 			return ;
 		} 
 		if(tempuser){
 			msg.content = "ｏ（╯□╰）ｏ您输入的邮箱已经被注册过了";
 			msg.status = 0;
 			res.render('register', { title: '注册',msg:msg });
 			return ;
 		}

 		UserDao.getUserInfoByName(name,function(err,tempuser){
 			if(err){
 				res.redirect('/500');
 				return ;
 			}
 			if(tempuser){
 				msg.content = "ｏ（╯□╰）ｏ名字已经重复，请重新输入一个优雅的名字";
 				msg.status = 0;
 				res.render('register', { title: '注册',msg:msg });
 				return ;
 			}
 			UserDao.getNextUidOfUser(function(err,uid){
 				if (err){
		 			res.redirect('common/500')
		 			return ;
		 		};   
 				var imgpath = path.join(config.upload_img_dir,name);
 				var savepath = path.resolve(path.join(imgpath,'default.jpg' ));
 				var defaultpath = path.resolve(path.join(config.upload_img_dir,'default.jpg' ));
 				var relapath = path.join(config.rela_upload_img_dir,name,'default.jpg');
 				if(!fs.existsSync(imgpath)){
 					fs.mkdirSync(imgpath);
 				} 
 				fs.readFile(defaultpath, function (err, data) {
 					if (err) {
 						res.redirect('500');
 					}
 					fs.writeFile(savepath, data, function (err) { 
 						if (err) {
 							res.redirect('500');
 						}			
 						UserDao.saveNewUser(uid,name,email,pwd,relapath,relapath,function(err){
							if (err) {
 								res.redirect('500');
 							}
							msg.content = "注册成功<a href='/login'>马上登录</a>";
 							msg.status = 1;
 							res.render('register', { title: '注册',msg:msg });
 						}); 
 					});
 				}); 
 			})  
		});
	});
};