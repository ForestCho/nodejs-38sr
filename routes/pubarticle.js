var	UserDao = require('../dao/userdao'); 
var	ArticleDao = require('../dao/articledao'); 
var Article = require('../models/article'); 
var	path = require('path');
var	mongoose = require('mongoose');
var	EventProxy = require('eventproxy');

//mongoose.connect('mongodb://localhost/blogdb');

/*
 * GET publish article page.
 */

 exports.save = function (req, res) {
 	var title = req.body.title;
 	var str = req.body.articlestr;
 	var label = req.body.label;
 	var cateid = req.body.cateid;
 	var classify = 0;
 	var name = req.session.user.name;
 	var uid = 0;
 	var tid = 0;
 	 
 	var ep = new EventProxy(); 
 	ep.assign("userinfo","tid",function (userinfo,tid) {
 		uid = userinfo.uid; 
		var articleItem = new Article({ 
 			tid:tid,
 			title:title,
 			content:str,
 			uid:uid,
 			_creator:userinfo._id,
 			flag:cateid,
 			classify:classify,
 			isdelete:false
 		});  
 		ArticleDao.saveNewArticleAsObject(articleItem,function(){
 			var condition = {uid:uid}; 
 			var update = {$inc:{score:1}};
 			var options = false; 
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

 exports.index = function (req, res) {  	
 	if(!req.session.user){
 		var prelink = "pub";
 		res.locals.error = "请先登录!!";
 		res.render('login', { title: '登录',prelink:prelink });
 	}else{
 		res.locals.pageflag = 3 ;
 		res.locals.userinfo = req.session.user; 
 		res.render('pubarticle', { title: '分享一个' });
 	}
 };

