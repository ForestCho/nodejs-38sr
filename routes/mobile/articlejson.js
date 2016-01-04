var	UserDao = require('../../dao/userdao'); 
var	ArticleDao = require('../../dao/articledao'); 
var	ReplyDao = require('../../dao/replydao'); 
var util = require('../../lib/util'); 
var At = require('../../lib/at');
var relationdao = require('../../dao/relationdao'); 
var EventProxy = require('eventproxy'); 
/*
 * GET article detail page.
 */

 exports.getdetail = function (req, res) {
 	var tid = req.query.tid;   
	var summaryNum = 3;
	var msg = {};
 	var ep = new EventProxy();
 	var proxy = new EventProxy();
	ep.assign("replies",function (replies) {  	
		msg.replies = replies;
		ArticleDao.getArticleByTid(tid,function(err,data){    
			data.view_count +=1;
			data.save(); 
			data.convertdate = util.date_format(data.post_date,true,true);
			msg.post_date =  util.date_format(data.post_date,true,true);
			msg.view_count = data.view_count;
			msg.reply_count = data.reply_count;
			msg.like_count = data.like_count;
			msg.unlike_count = data.unlike_count;
			msg._creator = data._creator;
			var b = /<img[^>]+src="[^"]+"[^>]*>/g ;
			var imglist = data.content.match(b)  
			var newcontent = data.purecontent;   
			msg.content = data.content;
			msg.summarynum = summaryNum; 
			res.json(msg);  
		});
 	});

	ReplyDao.getReplyByTidLimit(tid,summaryNum,function(err,data1){ 
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
					ep.emit("replies",data1);  
			}); 
		}); 

 };
 

	