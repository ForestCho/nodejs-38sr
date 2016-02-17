var	UserDao = require('../dao/userdao'); 
var	ArticleDao = require('../dao/articledao'); 
var	ReplyDao = require('../dao/replydao'); 
var util = require('../lib/util'); 
var at = require('../lib/at'); 
var RelationDao = require('../dao/relationdao'); 
var EventProxy = require('eventproxy'); 
var xssFilters = require('xss-filters');

/**
 * [detail 文章详细页面]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
 exports.detail = function (req, res) {
 	var tid = req.params.tid; 
 	var ep = new EventProxy();
 	var ep2 = new EventProxy();
 	var proxy = new EventProxy();
 	var currusername = '';
 	var curpath = '/';
 	var title;
 	if(typeof(req.session.user) !== 'undefined' ){
 		currusername = req.session.user.name;
 	} 	

 	ep.assign("d","followernum","hefollowernum",function (d,followernum,hefollowernum) { 
 		RelationDao.getListOfFollowersByName(d.userinfo.name,function(err,followerlist){ 
 			d.followerlist = followerlist;  
 			RelationDao.getListOfHeFollowsByName(d.userinfo.name,function(err,hefollowlist){ 
 				d.hefollowlist = hefollowlist;
 				d.followernum = followernum;
 				d.hefollowernum = hefollowernum;
 				res.locals.pageflag = 4 ;
 				res.locals.userinfo = req.session.user;  
 				curpath = '/t/'+tid;

 				if(d.articlecontent.title && d.articlecontent.title.length > 0 ){
						title = d.articlecontent.title 
				}else{
						title =  util.xss(d.articlecontent.purecontent);
				}

				if(d.articlecontent.flag > 1){
					res.locals.pageflag = 4;
				}else if(d.articlecontent.classify == 1){
					res.locals.pageflag = 1;

				}else if(d.articlecontent.classify == 2){
					res.locals.pageflag = 2;

				}else if(d.articlecontent.classify == 0){
					res.locals.pageflag = 0;

				}else{					
					res.locals.pageflag = -1;
				}
 				if(currusername){
 					RelationDao.countByName(currusername,d.userinfo.name,function(err,nums){
 						if(nums > 0){ 
 							d.isfollow = true ; 
 						} 	
 						res.render('articledetail', { title: title,d:d,curpath:curpath});					 
 					})
 				}else{
 					res.render('articledetail', { title: title,d:d,curpath:curpath});
 				}
 			}); 
 		}); 
 	});

 	ArticleDao.getArticleByTid(tid,function(err,data){    
 		data.view_count +=1;
 		data.save(); 
 		data.convertdate = util.date_format(data.post_date,true,true);
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
 				UserDao.getUserInfoByUid(data._creator.uid,function(err,tempuser){ 
 					var d = []; 
 					tempuser.joinDate = util.date_format(tempuser.create_at,false,false)+' 加入';
 					d.userinfo = tempuser; 
 					d.articlecontent = data; 
 					var tempstr = util.delHtmlTag(data.content);
 					if(tempstr.length >36){
 						d.articlecontent.purecontent = tempstr.substring(0,24)+'...';
 					}else{ 						
 						d.articlecontent.purecontent = tempstr;
 					} 
 					d.replies = data1;    
 					ep.emit("d",d); 
 				})
 			}); 
 		});
 	});

	ep.assign("d", function(d){
		var username = d.userinfo.name;
		RelationDao.getNumberOfFollowersByName(username,function(err,followernum){
			ep.emit("followernum",followernum); 
		}); 
		RelationDao.getNumberOfHeFollowersByName(username,function(err,hefollowernum){
			ep.emit("hefollowernum",hefollowernum);
		}); 
	});
 };
 
/**
 * [delete 删除文章json]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
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