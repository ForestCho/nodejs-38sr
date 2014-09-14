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

 exports.detail = function (req, res) {
 	var tid = req.params.tid; 
 	var ep = new EventProxy();
 	var proxy = new EventProxy();

 	ep.assign("d",function (d) { 
 		relationdao.getListOfFollowersByName(d.userinfo.name,function(err,followerlist){ 
 			d.followerlist = followerlist;  
 			relationdao.getListOfHeFollowsByName(d.userinfo.name,function(err,hefollowlist){ 
 				d.hefollowlist = hefollowlist;
 				res.locals.pageflag = 4 ;
 				res.locals.userinfo = req.session.user;  				
 				res.render('articledetail', { title: util.xss(d.articlecontent.content),d:d});
 			}); 
 		}); 
 	});

 	ArticleDao.getArticleByTid(tid,function(err,data){    
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
 						proxy.emit("reply_find");
 					});
 				})(i);
 			}

 			proxy.after('reply_find', data1.length, function(){
 				UserDao.getUserInfoByUid(data._creator.uid,function(err,tempuser){ 
 					var d = []; 
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

  exports.delete = function (req, res) {  	
 	var tid = req.query.tid; 
 	if(tid < 0){
 		res.json({status: 3 }); 
 		return;
 	}
 	ArticleDao.deleteArticleByTid(tid,function(err){
 		if(err){
 			res.json({status: 3 }); 
			return;
 		}
 		res.json({status: 0 }); 
 	}); 
  }