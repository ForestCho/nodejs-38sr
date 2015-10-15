var Relation = require('../models/relation'); 
var	UserDao = require('../dao/userdao'); 
var MessageDao = require('../dao/messagedao');
var path = require('path');
var mongoose = require('mongoose');
var EventProxy = require('eventproxy'); 
/*
 * 关注用户动作
 */
 exports.follow = function (req, res) {  	
 	if(!req.session.user){      
 		res.json({status:'failed'}); 
 	}else{ 
 		var followUid = req.query.followuid;
 		var follow = req.query.follow;
 		var myUid = 0;
 		var ep = new EventProxy();

 		if(followUid === '' || follow === ''){
 			res.json({status:'error'}); 
 			return;
 		}
 		
 		ep.assign("userinfo","userinfoby",function(userinfo,userinfoby){
 			myUid = userinfo.uid;
 			var relation = new Relation({
 				uid:myUid,
 				fuid:followUid,
 				_uid_info:userinfo._id,
 				_fuid_info: userinfoby._id
 			}); 
 			if(follow ==  "true"){ 
 				Relation.findOne({uid:relation.uid,fuid:relation.fuid},function(err,doc){
 					if (err) return handleError(err); 	
 					if(doc){ 
	 					res.json({status:'failed'}); 
	 					return ;
 					}else{ 
 						relation.save(function(err,relate){
	 					if (err) return handleError(err); 	
	 					MessageDao.saveFollowMsg(myUid,followUid,function(err){
	 						if (err) return handleError(err); 	
	 						res.json({status:'success'}); 
	 						return ;
	 					});
	 				});
 					}
 				}); 				
 			}else{ 
				Relation.remove({uid:relation.uid,fuid:relation.fuid},function(err,doc){
 					if (err) return handleError(err); 	
 					res.json({status:'success'}); 
 					return ;
 				}); 				
 			}
 		});

 		UserDao.getUserInfoByName(req.session.user.name,function(err,userinfo){
 			if(err){
 				res.redirect('/500');
 				return ;
 			} 
 			if(userinfo){	  		
 				ep.emit("userinfo",userinfo);
 			}
 		});
 		UserDao.getUserInfoByUid(followUid,function(err,userinfoby){
 			if(err){
 				res.redirect('/500');
 				return ;
 			} 
 			if(userinfoby){	  		
 				ep.emit("userinfoby",userinfoby);
 			}
 		});

 	}
 } 
