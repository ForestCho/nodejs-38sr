var LikeDao =  require('../../dao/likedao'); 
var ArticleDao = require('../../dao/articledao');
var path = require('path');
var mongoose = require('mongoose');
var EventProxy = require('eventproxy'); 
/*
 * GET process operator of like page.
 */
 exports.like = function (req, res) {  	
 	//status 0 error
 	//status 1 success
 	//status 2 have like 
 	//status 3 have not login
 	if(!req.query.uid){      
 		res.json({status: 3 } ); 
 		return ;
 	}

 	var tid = req.query.tid; 
 	var uid = req.query.uid; 
 	var islike = req.query.islike;
 	if(tid < 0 || uid < 0){
 		res.json({status: 0 }); 
 		return;
 	}

	LikeDao.getLikeNumByUidAndTid(uid,tid,function(err,count){
		if(err){ 
			res.json({status: 0 }); 
			return;
		}
		if(count > 1 || count === 1){
			res.json({status: 2}); 
			return;
		}
		LikeDao.saveNewLike(uid,tid,islike,function(err,like){
			if (err){
				res.json({status: 0 }); 
				return;
			}	
			var condition = {tid: tid};
			var update;
 			if(islike === 'true'){
				update = {$inc: {like_count:1}};
			}else{
				update = {$inc: {unlike_count:1}};
			}
			var options = { multi: false }; 
			ArticleDao.updateArticleInfo(condition,update,options,function(err,numberAffected, raw){
				if (err){
					res.json({status: 0 }); 
					return;
				}
				res.json({status: 1 }); 
			});
		});
	});  
 } 
