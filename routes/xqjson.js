var	UserDao = require('../dao/userdao');  
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
 	ep.assign("count","articlelist",'zymryj',function (count,articlelist,zymryj) {
 		var d= {}; 
	 		d.count = count;
	 		d.data = articlelist;   
	 	var mryj = ' 在人生的漫漫旅途中，有时热烈，有时寂寞，有时高兴，有时忧伤...这里可以记录这一切';
 			res.json(d);  
 	});

	var articleLimit = {flag:flag,isdelete:false}; 
	ArticleDao.getNumberOfArticlesAsObect(articleLimit,function (err,count) {
		ep.emit("count",count);
 	});
 	
 	ArticleDao.getArticleListLimitAsObject(puretext,page,pagesize,articleLimit,function(err,articlelist){ 
		for(var i =0;i<articlelist.length;i++){
			var b = /<img[^>]+src="[^"]+"[^>]*>/g ;
			var imglist = articlelist[i].content.match(b)   
			if(imglist !== null){
				if(imglist.length>0){
					var srcReg = /http:\/\/([^"]+)/i; 
					var srcStr = imglist[0].match(srcReg);  
					articlelist[i].pic= srcStr[0];//+"!limitmax";   
				}
			}   
			articlelist[i].author = articlelist[i]._creator.name;
			articlelist[i].uid = articlelist[i]._creator.uid;
			articlelist[i].authorimg = articlelist[i]._creator.photo; 
		}   
		ep.emit("articlelist",articlelist); 
 	})   
	ZymryjDao.getZymryjOfCurrday(function(err,zymryj){
 		ep.emit("zymryj",zymryj);
	});  
 }



