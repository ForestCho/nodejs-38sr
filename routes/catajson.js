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
 var cataArr = new Array('xinqing','joke','yule','baoliao','qinggan','qiongshi');
 var cataArrZH = new Array('心情','笑话','娱乐','爆料','情感','囧事');
 exports.xiaohua = function (req, res) { 
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
 	var page = 1;
 	var pagesize = config.index.list_article_size;
 	var puretext = true;
 	var list_hot_user_size = config.index.list_hot_user_size;
 	var count = 0; 
 	if(req.query.page){
 		page=req.query.page;
 	}  
 	var ep = new EventProxy(); 
 	ep.assign("count","articlelist","zymryj",function (count,articlelist,zymryj) {
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
			var newcontent = articlelist[i].purecontent;  
			if(imglist !== null){
				if(imglist.length>0){
					var srcReg = /http:\/\/([^"]+)/i; 
					var srcStr = imglist[0].match(srcReg); 
					articlelist[i].pic= srcStr[0];  
					if(articlelist[i].type == 1){	
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0].replace('large','wap180')+"' class='thumb'></a>"
					}else{
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0]+"!limitmax"+"' class='thumb'></a>"
					}
					newcontent= imgWrap+newcontent;
				}
			}  
			articlelist[i].author = articlelist[i]._creator.name;
			articlelist[i].uid = articlelist[i]._creator.uid;
			articlelist[i].authorimg = articlelist[i]._creator.photo;
			articlelist[i].text = newcontent; 
		}
		ep.emit("articlelist",articlelist);
 	})  

	ZymryjDao.getZymryjOfCurrday(function(err,zymryj){
 		ep.emit("zymryj",zymryj);
	}); 
  
 }



