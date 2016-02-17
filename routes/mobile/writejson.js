var	UserDao = require('../../dao/userdao'); 
var	ArticleDao = require('../../dao/articledao'); 
var	path = require('path');
var	mongoose = require('mongoose');
var	EventProxy = require('eventproxy');
 
 
 /**
  * [dowrite description]
  * @param  {[type]} req
  * @param  {[type]} res
  * @return {[type]}
  */
 exports.dowrite = function (req, res) {
 	var title = req.query.title;
 	var content = req.query.content; 
 	var cateid = req.query.cateid;
 	var name = req.query.name; 
 	var location = req.query.location; 
 	var uid = 0;
 	var tid = 0;
 	console.log(cateid);
	var msg = {};
 	var ep = new EventProxy(); 
	console.log(content);
 	ep.assign("userinfo","tid",function (userinfo,tid) {
 		uid = userinfo.uid; 
 		ArticleDao.saveNewArticleWithLocation(tid,title,content,uid,userinfo._id,cateid,location,function(){
 			var condition = {uid:uid}; 
 			var update = {$inc:{score:1}};
 			var options = false; 
 			UserDao.updateUserInfoFree(condition,update,options,function(err,num){ 
				if (err){
					msg.status = 0;
					res.json(msg);
					return ;
		 		};
				msg.status = 1;
 				res.json(msg);
 			});
 		}); 
 	})

 	UserDao.getUserInfoByName(name,function(err,userinfo){  
		if(err){
			msg.status = 0;
			res.json(msg);
			return;
		}
 		ep.emit("userinfo",userinfo); 		
 	});

 	ArticleDao.getMaxTid(function(err,maxtid){   		
		if(err){
			msg.status = 0;
			res.json(msg);
			return;
		}
 		ep.emit("tid",maxtid);
 	})

 }; 