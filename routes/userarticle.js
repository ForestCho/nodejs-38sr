var Article = require('../models/article'); 
var	UserDao = require('../dao/userdao'); 
var util = require('../lib/util');
var Relation = require('../models/relation');
var RelationDao = require('../dao/relationdao');
var ArticleDao = require('../dao/articledao');
var EventProxy = require('eventproxy');

/**
 * [index user page.]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
 exports.index = function (req, res) {  
 	var username  = req.params.username;
 	var currusername = '';
 	var curpath = '/';
 	var p = 1 ;
 	var pagesize = config.index.list_article_size;
 	if(req.query.p){
 		p = req.query.p;
 	} 

 	if(typeof(req.session.user) !== 'undefined' ){
 		currusername = req.session.user.name;
 	} 	
 	if(username === currusername){
 		res.locals.pageflag = 2 ;
 	} 
 	var ep = new EventProxy();
 	
 	ep.assign("tempuser","articlelist","followerlist","hefollowlist","followernum","hefollowernum","articlenum",function(tempuser,articlelist,followerlist,hefollowlist,followernum,hefollowernum,articlenum){
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
 		d.currentpage = p;
 		curpath = "/user/"+tempuser.name+"/article/";
 		if(currusername){
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
					return	res.render('userarticle', { title:username+'的心情',visituser:username,d:d,curpath:curpath}); 

				});
			}); 
		}else{  
 			res.locals.userinfo = req.session.user; 
 			return res.render('userarticle', { title:username+'的心情',visituser:username,d:d,curpath:curpath}); 
 		}
 	});


	UserDao.getUserInfoByName(username,function(err,tempuser) { 
		ep.emit("tempuser",tempuser);		 
		Article.find({uid:tempuser.uid,isdelete:false}).sort({'post_date':-1}).skip((p-1)*pagesize).limit(pagesize+1).populate('_creator').populate('_sid').exec(function(err,articlelist){
			if (err){
 				res.redirect('common/404')
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
			}else{
				newcontent= newcontent.substring(0,(newcontent.length > 180)?180:newcontent.length).trim();
			}
			articlelist[i].newcontent = newcontent; 
			}
			ep.emit("articlelist",articlelist);

		}); 
	});

	ArticleDao.getNumberOfArticlesByUsername(username,function(err,doc){
				ep.emit("articlenum",doc);
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
