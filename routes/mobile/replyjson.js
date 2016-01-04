var Article = require('../../models/article');
var	Reply = require('../../models/reply');
var	UserDao = require('../../dao/userdao');
var	ReplyDao = require('../../dao/replydao');
var	ArticleDao = require('../../dao/articledao');  
var	User = require('../../models/user'); 
var At = require('../../lib/at');
var util = require('../../lib/util'); 
var MessageDao = require('../../dao/messagedao');
var	path = require('path');
var	mongoose = require('mongoose');  
 
var EventProxy = require('eventproxy'); 

 exports.doreply = function (req, res) {
 	var repstr = req.body.repstr;
 	var	tid = req.body.tid; 
 	var username = req.body.name; 
 	var	rid = req.body.rid;
 	var	ruid; 
 	var cur_rid = 0; 

	var msg = {};
	UserDao.getUserInfoByName(username,function(err,tempuser){  
		if(err){
			msg.status = 0;
			msg.content = "·þÎñÆ÷´íÎó";
			res.json(msg);
			return;
		}
		if(!tempuser){
			msg.status = 0;
			msg.content = "·þÎñÆ÷´íÎó";
			res.json(msg);
			return ;
		}
		ArticleDao.getArticleByTid(tid,function(err1,articleinfo){
			if(err1){
				msg.status = 0;
				msg.content = "·þÎñÆ÷´íÎó";
				res.json(msg);
				return;
			}
			console.log(articleinfo._creator);
			ruid = articleinfo._creator.uid;			
			Reply.findOne().sort({'rid':-1}).exec(function(err2,doc){  
				if(err2){
					msg.status = 0;
					msg.content = "·þÎñÆ÷´íÎó";
					res.json(msg);
					return;
				}
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
				reply.save(function(err3){
					if (err3){
							msg.status = 0;
							msg.content = "·þÎñÆ÷´íÎó";
							res.json(msg);
							return ;
					} 
					Article.update({tid: tid}, {$inc: {reply_count:1}}, { multi: false },function(err4,numberAffected, raw){
						if (err4){
							msg.status = 0;
							msg.content = "·þÎñÆ÷´íÎó";
							res.json(msg);
							return ;
						} 
						At.sendMessageToMentionUsers(repstr,tid,tempuser.uid,cur_rid);
						MessageDao.saveReplyMsg(tempuser.uid,ruid,tid,cur_rid,function(err5){
							if (err5){
								msg.status = 0;
								msg.content = "·þÎñÆ÷´íÎó";
								res.json(msg);
								return ;
							} 
							msg.status = 1;
							msg.content = "ÆÀÂÛ³É¹¦";
							res.json(msg);						
						});
					});
				});  
		}) 
	});
	});	 
}; 


 exports.getreplylist = function (req, res) {
 	var tid = req.query.tid; 
 	var ep = new EventProxy();
 	var proxy = new EventProxy();

 	ep.assign("d",function (d) {  		
 		res.json(d);   
 	});
 
		ReplyDao.getReplyByTid(tid,function(err,data1){ 
			for(var i = 0 ; i < data1.length ; i++){ 
				(function (j) {
					data1[j].convertdate = util.date_format(data1[j].create_at,true,true);   
					At.linkUsersWithName(data1[i].content,function(err , str){
						if(err){
							res.redirect('500');
							return ;
						} 
						data1[j].content = str;
						data1[j].uid = data1[j]._creator.uid;
						data1[j].name = data1[j]._creator.name;
						data1[j].avatar = data1[j]._creator.photo;
						data1[j].createat = data1[j].create_at; 
						proxy.emit("reply_find");
					});
				})(i);
			}

			proxy.after('reply_find', data1.length, function(){ 
					var d = {};  
					d.replies = data1;    
					ep.emit("d",d);  
			}); 
		}); 
 }; 