var	UserDao = require('../dao/userdao'); 
var	MryjDao = require('../dao/mryjdao');   
var	util = require('../lib/util');   
var	ArticleDao = require('../dao/articledao');   
var	moment = require('moment'); 
var	config = require('../config').config;
var	EventProxy = require('eventproxy');
/*
 * GET home page.
 */

 exports.index = function (req, res) { 
 	var pageid = 1;
 	var pagesize = config.index.list_article_size;
 	var puretext = true;
 	var list_hot_user_size = config.index.list_hot_user_size;
 	var count = 0;
 	if(req.query.pageid){
 		pageid=req.query.pageid;
 	} 
 	if(req.session.user){
 		res.locals.userinfo = req.session.user;
 	} 
 	var ep = new EventProxy(); 
 	ep.assign("count","usercount","articlelist","hotuser","mryj",function (count,usercount,articlelist,hotuser,mryj) {
 		var d= []; 
	 		d.count = count;
	 		d.data = articlelist;
	 		d.hotuser = hotuser;
	 		d.usercount = usercount
 			res.locals.pageflag = 1 ; 
 		res.render('index', { title:'首页',d:d,pageid:pageid,mryj:mryj });
 	});

 	ArticleDao.getNumberOfArticles(function (err,count) {
		ep.emit("count",count);
 	});
 	
 	ArticleDao.getArticleListLimit(puretext,pageid,pagesize,function(err,articlelist){ 
		for(var i =0;i<articlelist.length;i++){
			var b = /<img[^>]+src="[^"]+"[^>]*>/g ;
			var imglist = articlelist[i].content.match(b)  
			var newcontent = articlelist[i].purecontent; 
			if(imglist !== null){
				if(imglist.length>0){
					var srcReg = /http:\/\/([^"]+)/i; 
					var srcStr = imglist[0].match(srcReg); 
					console.log(srcStr[0])
					var imgWrap = "<img src='"+srcStr[0]+"!limitmax"+"' class='thumb'>"
					newcontent= imgWrap+newcontent;
				}
			} 
			articlelist[i].newcontent = newcontent; 
		}
		ep.emit("articlelist",articlelist);
 	}) 
	
	UserDao.getUserListByScore(list_hot_user_size,function (err,hotuser) {  
	 		ep.emit("hotuser",hotuser);
	}) 

	MryjDao.getMryjOfCurrday(function(err,mryj){
 		ep.emit("mryj",mryj);
	}); 

 	UserDao.getNumberOfAllUser(function (err,usercount) {
 		ep.emit("usercount",usercount);
 	}); 
 }



