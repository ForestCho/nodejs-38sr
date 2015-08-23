var	UserDao = require('../dao/userdao'); 
var	MryjDao = require('../dao/mryjdao');   
var	ZymryjDao = require('../dao/zymryjdao');   
var	util = require('../lib/util');   
var	ArticleDao = require('../dao/articledao');   
var	moment = require('moment'); 
var	config = require('../config').config;
var	EventProxy = require('eventproxy');
/*
 * GET home page.
 */

 exports.index = function (req, res) { 
 	var page = 1;
 	var pagesize = config.index.list_article_size;
 	var puretext = true;
 	var list_hot_user_size = config.index.list_hot_user_size;
 	var count = 0;
 	var flag = 0;
 	if(req.query.page){
 		page=req.query.page;
 	} 
 	if(req.session.user){
 		res.locals.userinfo = req.session.user;
 	} 
 	var ep = new EventProxy(); 
 	ep.assign('zymryj',function (zymryj) { 
		var zy = {};
			zy.tid=1;
			zy.pic=zymryj.img;
			zy.cncontent = zymryj.cncontent;
			zy.encontent = zymryj.encontent;
		var obj = {};
		var shuzu = [];
			shuzu[0]=zy;
			obj.data = shuzu;
 			res.json(obj);  
 	});
 
	ZymryjDao.getZymryjOfCurrday(function(err,zymryj){
 		ep.emit("zymryj",zymryj);
	});  
 }



