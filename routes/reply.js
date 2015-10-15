var Article = require('../models/article');
var	Reply = require('../models/reply');
var	UserDao = require('../dao/userdao'); 
var	User = require('../models/user'); 
var At = require('../lib/at');
var MessageDao = require('../dao/messagedao');
var	path = require('path');
var	mongoose = require('mongoose');  
/*
 * 回复动作
 */
 exports.index = function (req, res) {
 	var repstr = req.body.repstr;
 	var	tid = req.body.tid;
 	var	rid = req.body.rid;
 	var	ruid = req.body.ruid;
 	var runame = req.body.runame;
 	var username = req.session.user.name;
 	var cur_rid = 0; 

 	UserDao.getUserInfoByName(username,function(err,tempuser){  
 		if(err){
 			res.redirect('500');
 			return ;
 		}
 		if(!tempuser){
 			res.redirect('400');
 			return ;
 		}
 		Reply.findOne().sort({'rid':-1}).exec(function(err1,doc){  
 			if(doc){ 
 				cur_rid = doc.rid + 1;  
 			}  
 			var reply = new Reply({ 
 				rid:cur_rid,
 				content: repstr ,
 				tid: tid,
 				replyid:rid,
 				uid:tempuser.uid,
 				ruid:ruid, 		
 				_creator:tempuser._id
 			});   
 			reply.save(function(){
 				Article.update({tid: tid}, {$inc: {reply_count:1}}, { multi: false },function(err,numberAffected, raw){
 					if (err){
 						res.redirect('/500');
 						return ;
 					} 
 					At.sendMessageToMentionUsers(repstr,tid,tempuser.uid,cur_rid);
 					MessageDao.saveReplyMsg(tempuser.uid,ruid,tid,cur_rid,function(err){
 						res.redirect('/article/'+tid); 						
 					});
 				});
 			});  
 		}) 
 	});	 
 }; 
