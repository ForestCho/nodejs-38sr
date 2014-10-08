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
 var cataArr = new Array('xinqing','joke','yule','baoliao','qinggan','qiongshi');
 var cataArrZH = new Array('心情','笑话','娱乐','爆料','情感','囧事');
 exports.joke = function (req, res) { 
 	var flag = 1;
 	category(req,res,flag)

 }
 exports.yule = function (req, res) { 
 	var flag = 2;
 	category(req,res,flag)

 }
 exports.baoliao = function (req, res) { 
 	var flag = 3;
 	category(req,res,flag)

 }
 exports.qinggan = function (req, res) { 
 	var flag = 4;
 	category(req,res,flag)

 }
 exports.qiongshi = function (req, res) { 
 	var flag = 5;
 	category(req,res,flag)

 }
var category = function (req, res,flag) { 
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
 	ep.assign("count","usercount","articlelist","hotuser","mryj","zymryj",function (count,usercount,articlelist,hotuser,mryj,zymryj) {
 		var d= []; 
	 		d.count = count;
	 		d.data = articlelist;
	 		d.hotuser = hotuser;
	 		d.usercount = usercount;
 			res.locals.pageflag = 0 ; 
 		var cataStr = cataArr[flag]; 
 		var cateZh = cataArrZH[flag];
 		res.render('index', { title:'首页',d:d,pageid:pageid,mryj:mryj,zymryj:zymryj,catastr:cataStr,catezh:cateZh });
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



