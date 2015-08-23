var	UserDao = require('../dao/userdao'); 
var	ArticleDao = require('../dao/articledao'); 
var	ReplyDao = require('../dao/replydao'); 
var util = require('../lib/util'); 
var Article = require('../models/article');
var	Reply = require('../models/reply');
var at = require('../lib/at'); 
var RelationDao = require('../dao/relationdao'); 
var EventProxy = require('eventproxy'); 
var xssFilters = require('xss-filters');
/*
 * GET article detail page.
 */

 exports.index = function (req, res) { 
 	var proxy = new EventProxy(); 
 	var curpath = '/';
 	var title = "网站反馈"; 
 	var tid = 1;
 	ArticleDao.getArticleByTid(tid,function(err,data){     
 		var replyLimit = {tid:tid};
 		ReplyDao.getReplyByAsObject(replyLimit,function(err,data1){ 
 			for(var i = 0 ; i < data1.length ; i++){ 
 				(function (j) {
 					data1[j].convertdate = util.date_format(data1[j].create_at,true,true);   
 					at.linkUsers(data1[i].content,function(err , str){
 						if(err){
 							res.redirect('500');
 							return ;
 						} 
 						data1[j].content = str;//xssFilters.inHTMLData(str); 
 						proxy.emit("reply_find");
 					});
 				})(i);
 			}

 			proxy.after('reply_find', data1.length, function(){
 				var d = [];
				d.replies = data1;
 				d.articlecontent = data;   
				console.log(d); 
				res.render('feedback', { title: title,d:d});
 			}); 
 		});
 	}); 
 };
 exports.dofb = function (req, res) {
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
 					res.redirect('/feedback'); 	 
 				});
 			});  
 		}) 
 	});	 
 }; 
