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
	return res.render('admin', { title:'admin'});   
}  
/*
 * GET admin_addsite page.
 */
 exports.admin_addsite = function (req, res) { 	 
	return res.render('admin_addsite', { title:'admin_addsite'});   
} 
/*
 * GET admin_crawer page.
 */
 exports.admin_crawer = function (req, res) { 	 
	return res.render('admin_crawer', { title:'admin_crawer'});   
} 
/*
 * GET admin_articles page.
 */
 exports.admin_articles = function (req, res) { 	  	var currusername = '';
 	var pageid = 1 ;
 	var pagesize = 8;
 	if(req.query.pageid){
 		pageid=req.query.pageid;
 	} 

 	if(typeof(req.session.user) !== 'undefined' ){
 		currusername = req.session.user.name;
 	} 	  
	Article.find({isdelete:false}).sort({'post_date':-1}).skip((pageid-1)*pagesize).limit(pagesize+1).populate('_creator').exec(function(err,articlelist){
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
					if(articlelist[i].type == 1){	
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0].replace('large','wap180')+"' class='thumb'></a>"
					}else{
						var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0]+"!limitmax"+"' class='thumb'></a>"
					}
					newcontent= imgWrap+newcontent;
				}
			} 
			articlelist[i].newcontent = newcontent; 
			}
		var d= [];  
 		for(i=0 ; i< articlelist.length ; i++){ 
 			articlelist[i].convertdate = util.date_format(articlelist[i].post_date,true);  
 		}
 		d.data = articlelist;   
 		d.currentpage = pageid; 
		res.locals.userinfo = req.session.user; 
		return res.render('admin_articles', { title:'admin_articles',d:d});  
	});   
} 