var Article = require('../models/article'); 
var	UserDao = require('../dao/userdao'); 
var util = require('../lib/util');
var Relation = require('../models/relation');
var relationdao = require('../dao/relationdao');
var EventProxy = require('eventproxy'); 
/*
 * GET user page.
 */
 exports.index = function (req, res) {  
 	var username  = req.params.username;
 	var pagesize = 12 ;
 	var currusername = '';
 	if(typeof(req.session.user) !== 'undefined' ){
 		currusername = req.session.user.name;
 	} 	
 	if(username === currusername){
 		res.locals.pageflag = 2 ;
 	} 
 	var ep = new EventProxy();
 	
 	ep.assign("tempuser","articlelist","followerlist","hefollowlist",function(tempuser,articlelist,followerlist,hefollowlist){
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
 					console.log(res.locals.userinfo)
 					res.locals.userinfo = req.session.user; 
 					return	res.render('user', { title:'我的主页',visituser:username,d:d}); 

 				});
 			});
 		}else{  
 			res.locals.userinfo = req.session.user; 
 			return res.render('user', { title:'我的主页',visituser:username,d:d}); 
 		}
 	});


	UserDao.getUserInfoByName(username,function(err,tempuser) { 
		ep.emit("tempuser",tempuser);
		Article.find({uid:tempuser.uid}).sort({'post_date':-1}).limit(pagesize+1).populate('_creator').exec(function(err,articlelist){
			if (err){
 				res.redirect('common/404')
 				return ;
 			}    

 			for(var i =0;i<articlelist.length;i++){
			var b = /<img[^>]+src="[^"]+"[^>]*>/g ;
			var imglist = articlelist[i].content.match(b)  
	 		
	 		articlelist[i].purecontent = util.delHtmlTag(articlelist[i].content);
			var newcontent = articlelist[i].purecontent; 
			if(imglist !== null){
				if(imglist.length>0){
					var srcReg = /http:\/\/([^"]+)/i; 
					var srcStr = imglist[0].match(srcReg); 
					console.log(srcStr)
					var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0]+"!limitmax"+"' class='thumb'></a>"
					newcontent= imgWrap+newcontent;
				}
			} 
			articlelist[i].newcontent = newcontent; 
			}
			ep.emit("articlelist",articlelist);

		}); 
	});

	relationdao.getListOfFollowersByName(username,function(err,followerlist){
		ep.emit("followerlist",followerlist);
	}); 
	
	relationdao.getListOfHeFollowsByName(username,function(err,hefollowlist){
		ep.emit("hefollowlist",hefollowlist);
	}); 
} 
