var Article = require('../models/article'); 
var	UserDao = require('../dao/userdao'); 
var util = require('../lib/util');
var Relation = require('../models/relation');
var RelationDao = require('../dao/relationdao');
var ArticleDao = require('../dao/articledao');
var EventProxy = require('eventproxy'); 

/*
*
*GET user info
*/ 
 exports.index = function (req, res) {  
 	var curuid  = req.query.curuid; 
 	var myuid = 0;
	myuid = req.query.myuid;  
 	var ep = new EventProxy();
 	console.log(curuid);
 	console.log(myuid);
 	ep.assign("tempuser","followerlist","hefollowlist","articlenum",function(tempuser,followerlist,hefollowlist,articlenum){
 		var msg= {};    
 		msg.joinDate = util.date_format(tempuser.create_at,false,false);
 		msg.userinfo = tempuser; 
 		msg.isfollow = false; 
 		msg.followerlist = followerlist; 
 		msg.hefollowlist = hefollowlist; 
 		msg.articlenum = articlenum;
 		if(myuid>0 && myuid !== curuid){
 			var curuid = 0;  
 			UserDao.getUserInfoByUid(myuid,function(err,curuser){ 
 				if (err){
 					return ;
 				}   
 				curuid = curuser.uid;  
 				Relation.count({uid:curuid,fuid:tempuser.uid},function(err,nums){ 
 					if(nums > 0){ 
 						d.isfollow = true ; 
 					} 			
					console.log(msg);
 					res.json(msg); 
					return ;
 				});
 			});
		}else{  	 
					console.log(msg);
			res.json(msg); 
			return ; 
 		}
 	});

	ArticleDao.getNumberOfArticlesByUid(curuid,function(err,doc){
		ep.emit("articlenum",doc);
	});

	UserDao.getUserInfoByUid(curuid,function(err,tempuser) { 
		ep.emit("tempuser",tempuser); 
	});

	RelationDao.getListOfFollowersByUid(curuid,function(err,followerlist){
		ep.emit("followerlist",followerlist);
	}); 
	
	RelationDao.getListOfHeFollowsByUid(curuid,function(err,hefollowlist){
		ep.emit("hefollowlist",hefollowlist);
	}); 
} 


 exports.articlelist = function (req, res) { 
 	var page = 1;
 	var pagesize = config.index.list_article_size;
 	var puretext = true; 
 	var count = 0;
 	var flag = 0;
	var uid = req.query.uid;
 	if(req.query.page){
 		page=req.query.page;
 	}  
 	var ep = new EventProxy(); 
 	ep.assign("count","articlelist",function (count,articlelist) {
 		var d= {}; 
	 		d.count = count;
	 		d.data = articlelist;   
 			res.json(d);  
 	});

 	ArticleDao.getNumberOfArticlesByUid(uid,function (err,count) {
		ep.emit("count",count);
 	});
 	
 	ArticleDao.getArticleListLimitByUid(puretext,page,pagesize,flag,uid,function(err,articlelist){ 
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
 }