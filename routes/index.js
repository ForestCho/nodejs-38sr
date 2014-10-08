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
 	var pageid = 1;
 	var pagesize = config.index.list_article_size;
 	var puretext = true;
 	var list_hot_user_size = config.index.list_hot_user_size;
 	var count = 0;
 	var flag = 0;
 	if(req.query.pageid){
 		pageid=req.query.pageid;
 	} 
 	if(req.session.user){
 		res.locals.userinfo = req.session.user;
 	} 
 	var ep = new EventProxy(); 
 	ep.assign("count","usercount","articlelist","hotuser","mryj",'zymryj',function (count,usercount,articlelist,hotuser,mryj,zymryj) {
 		var d= []; 
	 		d.count = count;
	 		d.data = articlelist;
	 		d.hotuser = hotuser;
	 		d.usercount = usercount;
 			res.locals.pageflag = 1 ; 
 			var cateZh = '心情';  
 		res.render('index', { title:'首页',d:d,pageid:pageid,mryj:mryj,zymryj:zymryj,catezh:cateZh  });
 	});

 	ArticleDao.getNumberOfArticles(flag,function (err,count) {
		ep.emit("count",count);
 	});
 	
 	ArticleDao.getArticleListLimit(puretext,pageid,pagesize,flag,function(err,articlelist){ 
		for(var i =0;i<articlelist.length;i++){
			var b = /<img[^>]+src="[^"]+"[^>]*>/g ;
			var imglist = articlelist[i].content.match(b)  
			var newcontent = articlelist[i].purecontent;  
			if(imglist !== null){
				if(imglist.length>0){
					var srcReg = /http:\/\/([^"]+)/i; 
					var srcStr = imglist[0].match(srcReg); 
					console.log(articlelist[i].type)
					if(articlelist[i].type == 1){	
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0].replace('large','wap180')+"' class='thumb'></a>"
					}else{
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0]+"!limitmax"+"' class='thumb'></a>"
					}
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
	ZymryjDao.getZymryjOfCurrday(function(err,zymryj){
 		ep.emit("zymryj",zymryj);
	}); 
 	UserDao.getNumberOfAllUser(function (err,usercount) {
 		ep.emit("usercount",usercount);
 	}); 
 }



