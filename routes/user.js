var Article = require('../models/article'); 
var	UserDao = require('../dao/userdao'); 
var util = require('../lib/util');
var Relation = require('../models/relation');
var RelationDao = require('../dao/relationdao');
var ArticleDao = require('../dao/articledao');
var EventProxy = require('eventproxy'); 

/*
*
*GET user info
*/

exports.getuserinfo = function(req,res){
 	var uid = req.query.uid; 
 	var rspjson = {};

 	UserDao.getUserInfoByUid(uid,function(err,userinfo){  
 		rspjson.name = userinfo.name;
 		rspjson.cometime = util.date_format(userinfo.create_at,false,false);
 		ArticleDao.getNumberOfArticlesByUid(uid,function(err,num){
 			rspjson.articlenum = num;
 			res.json(rspjson);
 		})
 	});
}
/*
 * GET user page.
 */
 exports.index = function (req, res) {  
 	var username  = req.params.username;
 	var pagesize = 12 ;
 	var curpath = '/';
 	var currusername = '';
 	if(typeof(req.session.user) !== 'undefined' ){
 		currusername = req.session.user.name;
 	} 	
 	if(username === currusername){
 		res.locals.pageflag = 2 ;
 	} 
 	var ep = new EventProxy();
 	
 	ep.assign("tempuser","articlelist","followerlist","hefollowlist","articlenum","followernum","hefollowernum",function(tempuser,articlelist,followerlist,hefollowlist,articlenum,followernum,hefollowernum){
 		var d= [];  
 		for(i=0 ; i< articlelist.length ; i++){ 
 			articlelist[i].convertdate = util.date_format(articlelist[i].post_date,true);  
 		}
 		d.data = articlelist;  
 		tempuser.joinDate = util.date_format(tempuser.create_at,false,false)+' 加入';
 		d.userinfo = tempuser;
 		d.isfollow = false; 
 		d.followerlist = followerlist; 
 		d.hefollowlist = hefollowlist; 
 		d.followernum = followernum;
 		d.hefollowernum = hefollowernum;
 		d.articlenum = articlenum;
 		curpath = "/user/"+tempuser.name;
 		if(currusername && username !== currusername){
 			var curuid = 0;  
 			UserDao.getUserInfoByName(currusername,function(err,curuser){ 
 				if (err){
 					res.redirect('common/404')
 					return ;
 				}   
 				curuid = curuser.uid;  
 				Relation.count({uid:curuid,fuid:tempuser.uid},function(err,nums){ 
 					if(nums > 0){ 
 						d.isfollow = true ; 
 					} 						 
 					res.locals.userinfo = req.session.user;  
 					return	res.render('user', { title:username+'的主页',visituser:username,d:d,curpath:curpath});  
 				});
 			});
 		}else{  
 			res.locals.userinfo = req.session.user; 
 			if(!currusername){
 				return	res.render('user', { title:username+'的主页',visituser:username,d:d,curpath:curpath});  
 			}
 			return res.render('user', { title:'我的主页',visituser:username,d:d,curpath:curpath}); 
 		}
 	});

	ArticleDao.getNumberOfArticlesByUsername(username,function(err,doc){
				ep.emit("articlenum",doc);
	});

	UserDao.getUserInfoByName(username,function(err,tempuser) { 
		ep.emit("tempuser",tempuser);
		Article.find({uid:tempuser.uid,isdelete:false}).sort({'post_date':-1}).limit(pagesize+1).populate('_creator').populate('_sid').lean(true).exec(function(err,articlelist){
			if (err){
 				res.redirect('/404')
 				return ;
 			}    

 			for(var i =0;i<articlelist.length;i++){
			var b = /<img[^>]+src="[^"]+"[^>]*>/g ;
			var imglist = articlelist[i].content.match(b)  
	 		
	 		articlelist[i].purecontent = util.delHtmlTag(articlelist[i].content);
			var newcontent = articlelist[i].purecontent; 
			if(articlelist[i].classify == 1){
				articlelist[i].title = encodeURIComponent(articlelist[i].title);
			}  
			if(imglist !== null){
				if(imglist.length>0){
					var srcReg = /http:\/\/([^"]+)/i; 
					var srcStr = imglist[0].match(srcReg);  
					if(articlelist[i].type == 1){	
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0].replace('large','wap180')+"' class='thumb'></a>"
					}else{
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0]+"!limitmax"+"' class='thumb'></a>"
					}

					newcontent= imgWrap+newcontent.substring(0,(newcontent.length > 150)?150:newcontent.length).trim(); 
				}
			} else{
				newcontent= newcontent.substring(0,(newcontent.length > 180)?180:newcontent.length).trim();
			}

			articlelist[i].newcontent = newcontent; 
			}
			ep.emit("articlelist",articlelist);

		}); 
	});
	RelationDao.getNumberOfFollowersByName(username,function(err,followernum){
		ep.emit("followernum",followernum);
	}); 
	RelationDao.getNumberOfHeFollowersByName(username,function(err,hefollowernum){
		ep.emit("hefollowernum",hefollowernum);
	}); 

	RelationDao.getListOfFollowersByName(username,function(err,followerlist){
		ep.emit("followerlist",followerlist);
	}); 
	
	RelationDao.getListOfHeFollowsByName(username,function(err,hefollowlist){
		ep.emit("hefollowlist",hefollowlist);
	}); 
} 


/*
 * GET user page.
 */
 exports.getfollower = function (req, res) {  
 	var username  = req.params.username; 
 	var currusername = '';
 	if(typeof(req.session.user) !== 'undefined' ){
 		currusername = req.session.user.name;
 	} 	
 	if(username === currusername){
 		res.locals.pageflag = 2 ;
 	} 
 	var ep = new EventProxy();
 	
 	ep.assign("tempuser","followerlist","followernum",function(tempuser,followerlist,followernum){
 		var d= [];  
 		d.userinfo = tempuser; 
 		d.followerlist = followerlist;  
 		d.followernum = followernum;   
 		if(currusername && username !== currusername){ 
 			return	res.render('follower', { title:username+'的粉丝',visituser:username,d:d});  
 		}else{   
 			res.locals.userinfo = req.session.user; 
 			return res.render('follower', { title:'我的粉丝',visituser:username,d:d}); 
 		}
 	});


	UserDao.getUserInfoByName(username,function(err,tempuser) { 
		ep.emit("tempuser",tempuser);  
	});
	RelationDao.getNumberOfFollowersByName(username,function(err,followernum){
		ep.emit("followernum",followernum);
	});  

	RelationDao.getListOfAllFollowersByName(username,function(err,followerlist){
		ep.emit("followerlist",followerlist);
	});  
} 

/*
 * GET user page.
 */
 exports.gethefollower = function (req, res) {  
 	var username  = req.params.username; 
 	var currusername = '';
 	if(typeof(req.session.user) !== 'undefined' ){
 		currusername = req.session.user.name;
 	} 	
 	if(username === currusername){
 		res.locals.pageflag = 2 ;
 	} 
 	var ep = new EventProxy();
 	
 	ep.assign("tempuser","hefollowerlist","hefollowernum",function(tempuser,hefollowerlist,hefollowernum){
 		var d= [];  
 		d.userinfo = tempuser; 
 		d.hefollowerlist = hefollowerlist;  
 		d.hefollowernum = hefollowernum;   
 		console.log(d);
 		if(currusername && username !== currusername){ 
 			return	res.render('hefollower', { title:username+'的拥趸',visituser:username,d:d});  
 		}else{   
 			res.locals.userinfo = req.session.user; 
 			return res.render('hefollower', { title:'我的拥趸',visituser:username,d:d}); 
 		}
 	});


	UserDao.getUserInfoByName(username,function(err,tempuser) { 
		ep.emit("tempuser",tempuser);  
	});
	RelationDao.getNumberOfHeFollowersByName(username,function(err,hefollowernum){
		ep.emit("hefollowernum",hefollowernum);
	});  

	RelationDao.getListOfAllHeFollowsByName(username,function(err,hefollowerlist){
		ep.emit("hefollowerlist",hefollowerlist);
	});  
} 