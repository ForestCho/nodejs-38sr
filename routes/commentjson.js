var	UserDao = require('../dao/userdao'); 
var	ArticleDao = require('../dao/articledao'); 
var	ReplyDao = require('../dao/replydao'); 
var util = require('../lib/util'); 
var at = require('../lib/at'); 
var relationdao = require('../dao/relationdao'); 
var EventProxy = require('eventproxy'); 
/*
 * GET article detail page.
 */

 exports.index = function (req, res) {
 	var tid = req.query.tid; 
 	var ep = new EventProxy();
 	var proxy = new EventProxy();

 	ep.assign("d",function (d) {  		
 		res.json(d);   
 	});

 	ArticleDao.getArticleByTid(tid,function(err,data){    
 		data.view_count +=1;
 		data.save(); 
 		data.convertdate = util.date_format(data.post_date,true,true);
 		ReplyDao.getReplyByTid(tid,function(err,data1){ 
 			for(var i = 0 ; i < data1.length ; i++){ 
 				(function (j) {
 					data1[j].convertdate = util.date_format(data1[j].create_at,true,true);   
 					at.linkUsers(data1[i].content,function(err , str){
 						if(err){
 							res.redirect('500');
 							return ;
 						} 
 						data1[j].content = str;
 						data1[j].name = data1[j]._creator.name;
 						data1[j].avatar = data1[j]._creator.photo;
 						data1[j].createat = data1[j].create_at;
 						proxy.emit("reply_find");
 					});
 				})(i);
 			}

 			proxy.after('reply_find', data1.length, function(){
 				UserDao.getUserInfoByUid(data._creator.uid,function(err,tempuser){ 
 					var d = {}; 
 					tempuser.joinDate = util.date_format(tempuser.create_at,false,false)+' 加入';
 					d.userinfo = tempuser; 
 					d.articlecontent = data; 
 					d.replies = data1;    
 					ep.emit("d",d); 
 				})
 			}); 
 		});
 	});
 }; 