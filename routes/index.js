var	UserDao = require('../dao/userdao'); 
var	MryjDao = require('../dao/mryjdao');   
var	ZymryjDao = require('../dao/zymryjdao');   
var	util = require('../lib/util');   
var	ArticleDao = require('../dao/articledao');   
var	moment = require('moment'); 
var	config = require('../config').config;
var	cache = require('../common/cache');
var	EventProxy = require('eventproxy');
var mongoose = require('mongoose'); 
/*
 * GET home page.
 */

//mongoose.connect('mongodb://127.0.0.1/blogdb');
mongoose.connect('mongodb://caosl:123456@127.0.0.1:27017/blogdb');

var commonQuery = function (req, res,curpath,articleLimit,cataZh) { 
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
 	ep.assign("count","usercount","articlelist","hotuser","mryj",'zymryj',function (count,usercount,articlelist,hotuser,mryj,zymryj) {
 		var d= []; 
	 		d.count = count;
	 		d.data = articlelist;
	 		d.hotuser = hotuser;
	 		d.usercount = usercount;  
 		res.render('index', { title:'做一名简单的锶者!',curpath:curpath,d:d,pageid:pageid,mryj:mryj,zymryj:zymryj,cataZh:cataZh});
 	});
 
 	ArticleDao.getNumberOfArticlesAsObect(articleLimit,function (err,count) {
		ep.emit("count",count);
 	});
 	

 	ArticleDao.getArticleListLimitAsObject(puretext,pageid,pagesize,articleLimit,function(err,articlelist){  
		for(var i =0;i<articlelist.length;i++){
			var b = /<img[^>]+src="[^"]+"[^>]*>/g ;
			var imglist = articlelist[i].content.match(b)  
			var newcontent = articlelist[i].purecontent;
			if(articlelist[i].classify != 0){
				articlelist[i].title = encodeURIComponent(articlelist[i].title);
			}  
			if(imglist !== null){
				if(imglist.length>0){
					var srcReg = /http:\/\/([^"]+)/i; 
					var srcStr = imglist[0].match(srcReg);  
					if(articlelist[i].type == 1){	
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0].replace('large','wap180')+"' class='thumb'></a>"
					}else{
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0]+"!limitmax"+"' class='thumb'></a>"
					}  
					newcontent= imgWrap+newcontent.substring(0,(newcontent.length > 150)?150:newcontent.length).trim();
				}
			}else{				
				newcontent= newcontent.substring(0,(newcontent.length > 180)?180:newcontent.length).trim();
			} 
			articlelist[i].newcontent = newcontent;  
		}

		ep.emit("articlelist",articlelist);
 	})  

	cache.get('hotuser', ep.done(function (hotuser) { 
	    if (hotuser) { 
	        ep.emit('hotuser', hotuser);
	    } else { 
	    	UserDao.getUserListByScore(list_hot_user_size,
	        ep.done('hotuser', function (hotuser) {
	          cache.set('hotuser', hotuser, 4 * 60 * 1);
	          return hotuser;
	        })
	      );
	    }
	  })); 

	cache.get('zymryj', ep.done(function (zymryj) { 
	    if (zymryj) { 
	        ep.emit('zymryj', zymryj);
	    } else { 
	    	ZymryjDao.getZymryjOfCurrday(
	        ep.done('zymryj', function (zymryj) {
	          cache.set('zymryj', zymryj, 24 * 60 * 1);
	          return zymryj;
	        })
	      );
	    }
	  }));  
	MryjDao.getMryjOfCurrday(function(err,mryj){
 		ep.emit("mryj",mryj);
	});  
 	UserDao.getNumberOfAllUser(function (err,usercount) {
 		ep.emit("usercount",usercount);
 	}); 
 }

//首页路由
 exports.index = function (req, res) {  
 	var flag = 0;
 	var cataZh = "个记录";
 	var classify = 1;
 	var curpath = "/";
 	res.locals.pageflag = 1;
	var articleLimit = {'$or':[{flag:flag},{classify:classify}],isdelete:false}; 	
 	commonQuery(req,res,curpath,articleLimit,cataZh);  
 }

 //心情路由
exports.xinqing = function (req, res) {  
 	var flag = 0; 
 	var cataZh = "条心情";
 	var curpath = "/xinqing";
 	res.locals.pageflag = 2;
	var articleLimit = {flag:flag,isdelete:false}; 
 	commonQuery(req,res,curpath,articleLimit,cataZh);  
 }

 //快链路由
 exports.fastlink = function (req, res) {  	 
 	var classify = 1;
 	var cataZh = "条快链";
 	var curpath = "/fastlink"; 	  	
 	res.locals.pageflag = 3;
	var articleLimit = {classify:classify,isdelete:false}; 	
 	commonQuery(req,res,curpath,articleLimit,cataZh);  
 }

//笑话路由
 exports.xiaohua = function (req, res) { 	 
 	var curpath = "/xiaohua";  
 	var cataZh = "句笑话";
 	var curpath = "/xiaohua"; 	
 	res.locals.pageflag = 4;
	var articleLimit = {flag:{'$gt':1},isdelete:false}; 
 	commonQuery(req,res,curpath,articleLimit,cataZh);  
 }