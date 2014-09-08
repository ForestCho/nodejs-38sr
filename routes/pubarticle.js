var	UserDao = require('../dao/userdao'); 
var	ArticleDao = require('../dao/articledao'); 
var	path = require('path');
var	mongoose = require('mongoose');
var	EventProxy = require('eventproxy');

mongoose.connect('mongodb://localhost/blogdb');

/*
 * GET publish article page.
 */

 exports.save = function (req, res) {
 	var str = req.query.articlestr;
 	var name = req.session.user.name;
 	var uid = 0;
 	var tid = 0;

 	var ep = new EventProxy(); 
 	ep.assign("userinfo","tid",function (userinfo,tid) {
 		uid=userinfo.uid; 
 		ArticleDao.saveNewArticle(tid,str,str,uid,userinfo._id,function(){
 			var condition = {uid:uid};
 			var update = {$inc:{score:1}};
 			var options =false;
 			UserDao.updateUserInfoFree(condition,update,options,function(err,num){
				if (err){
		 			res.redirect('common/500')
		 			return ;
		 		};   
 				res.redirect('/');
 			});
 		}); 
 	})

 	UserDao.getUserInfoByName(name,function(err,userinfo){   
 		ep.emit("userinfo",userinfo); 		
 	});

 	ArticleDao.getMaxTid(function(err,maxtid){   
 		ep.emit("tid",maxtid);
 	})

 };

 exports.complex = function (req, res) {  	
 	if(!req.session.user){
 		var prelink = "pubarticle";
 		res.locals.error = "请先登录!!";
 		res.render('login', { title: '登录',prelink:prelink });
 	}else{
 		res.locals.pageflag = 3 ;
 		res.locals.userinfo = req.session.user; 
 		res.render('pubarticle', { title: '发表心情' });
 	}
 };

