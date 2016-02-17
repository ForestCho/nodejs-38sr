var	UserDao = require('../dao/userdao'); 
var	ArticleDao = require('../dao/articledao');
var	SiteDao = require('../dao/sitedao'); 
var Article = require('../models/article');  
var Site = require('../models/site'); 
var	path = require('path');
var request = require('request');
var util = require('../lib/util');
var	mongoose = require('mongoose'); 
var	EventProxy = require('eventproxy');
 
/**
 * [save 保存快链]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
 exports.save = function (req, res) {
 	var url = req.query.url;
 	var publinkbrief = req.query.publinkbrief;
 	var classify = 1 ;
 	var name = req.session.user.name;
 	var uid = 0;
 	var tid = 0;
 	 
 	var ep = new EventProxy(); 
 	var domain = util.getDomain(url);

 	ep.assign("userinfo","tid","siteinfo",function (userinfo,tid,siteinfo) {
 		uid = userinfo.uid; 
 		var articleItem = new Article({ 
 			tid:tid,
 			title:url,
 			content:publinkbrief,
 			uid:uid,
 			_sid:siteinfo._id,
 			_creator:userinfo._id,
 			classify:classify,
 			isdelete:false
 		});  
 		ArticleDao.saveNewArticleAsObject(articleItem,function(){
 			var condition = {uid:uid}; 
 			var update = {$inc:{score:1}};
 			var options = false; 
 			UserDao.updateUserInfoFree(condition,update,options,function(err,num){ 
				if (err){
		 			res.redirect('/500')
		 			return ;
		 		};   
 				res.redirect('/');
 			});
 		}); 
 	})

 	UserDao.getUserInfoByName(name,function(err,userinfo){   
 		ep.emit("userinfo",userinfo); 		
 	});

 	ArticleDao.getMaxTid(function(err,maxtid){   
 		ep.emit("tid",maxtid);
 	});

	var domainRegex = new RegExp(domain, 'i');
 	var siteLimit = {sdomain:domainRegex};
 	SiteDao.getSiteByObj(siteLimit,function(err,siteinfo){
 		if(siteinfo){
 			ep.emit("siteinfo",siteinfo);
 		}else{
 			SiteDao.getMaxSid(function(err, maxsid) {
				var site = new Site({
					sid: maxsid,
					sname: domain,
					sdomain: domain,
					sbrief: domain,
					spic: "http://srpic.b0.upaiyun.com/site/www.38sr.com.jpg"
				});
				SiteDao.saveNewSite(site, function(err) { 
 					ep.emit("siteinfo",site);	 
				});
			}); 
 		}
 	});

 };
 
/**
 * [redirect 快链点击]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
 exports.redirect =function(req,res){
 	var url = req.query.url; 
 	console.log(url);	
 	res.redirect(url);
 };


/**
 * [getlinktitle 查询快链标题]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
 exports.getlinktitle = function(req, res){
 	var url = req.query.url;
 	var msg = {}; 
 	if(url.indexOf('https') == 0){
 		url = url.replace('https','http');
 	}
	request.get({url:url,headers:{'User-Agent':'request'}},function(err,req,data){
		 var html;
	    if(data != null){
	      html = data.toString();
	    } 
	    if(typeof(html) === 'undefined'){
		    msg.status  = 1;
		    msg.title = "我无法获取链接的标题呢，动动手吧";
	    }else{
	    	if(html.length > 0){
			    var reg = /<title.*?>([\s\S]*?)<\/title>/i  ;
			    var resultArr = reg.exec(html);
			    var title = "需要手工获取噢";
			    if(resultArr.length == 2){
			   		 title = resultArr[1]; 
			    }
			    title = title.replace("<title>","");
			    title = title.replace("</title>","");  
			    msg.status  = 0;
			    msg.title = title.trim();
	    	}else{
			    msg.status  = 1;
			    msg.title = "我无法获取链接的标题呢，动动手吧";
	    	}
		} 
		res.json(msg); 
	}); 
 }　


