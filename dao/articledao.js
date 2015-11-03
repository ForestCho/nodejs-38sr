var Article = require('../models/article'); 
var UserDao = require('../dao/userdao'); 
var	util = require('../lib/util');

//通过tid得到文章
var getArticleByTid = function(tid,cb){
	Article.findOne({tid:tid,isdelete:false}).populate('_creator').exec(cb)
}
//通过Object得到文章的数量
var getNumberOfArticlesAsObect = function(articleLimit,cb){
 	Article.count(articleLimit,cb);
}
//通过用户UID文章的数量
var getNumberOfArticlesByUid = function(uid,cb){
 	Article.count({uid:uid,isdelete:false},cb);
}

//通过用户名获取文章的数量
var getNumberOfArticlesByUsername = function(username,cb){
	UserDao.getUserInfoByName(username,function(err,doc){
	 	Article.count({uid:doc.uid,isdelete:false},cb);
	});
}
//搜索内容获取数量
var getNumberByContent = function(content,cb){
	var searchStr = new RegExp(content);
 	Article.count({content:searchStr},cb);
}

//通过json获取文章
var getArticleListLimitAsObject = function(puretext,pageid,pagesize,articleLimit,cb){ 
 	Article.find(articleLimit).sort({'post_date':-1}).skip((pageid-1)*pagesize).limit(pagesize).populate('_creator').populate('_sid').lean(true).exec(function(err,articlelist){
		var temp ="";
		var temp1 ="";
	 	for(i = 0 ; i < articlelist.length ; i++ ){ 
	 		articlelist[i].convertdate = util.date_format(articlelist[i].post_date,true,true);  
	 	} 
	 	if(puretext){
	 		for(i = 0 ; i < articlelist.length ; i++ ){ 
	 			articlelist[i].purecontent = util.delHtmlTag(articlelist[i].content);   
	 		} 
	 	}
	 	cb(err,articlelist); 
 	}) 
}

//文章用户的数量
var getArticleListLimitByUid = function(puretext,pageid,pagesize,flag,uid,truetimetype,cb){
 	Article.find({flag:flag,uid:uid,isdelete:false}).sort({'post_date':-1}).skip((pageid-1)*pagesize).limit(pagesize).populate('_creator').lean(true).exec(function(err,articlelist){
		var temp ="";
		var temp1 ="";
		if(!truetimetype){
			for(i = 0 ; i < articlelist.length ; i++ ){ 
				articlelist[i].convertdate = util.date_format(articlelist[i].post_date,true,true);  
			} 
		}else{
			for(i = 0 ; i < articlelist.length ; i++ ){ 
				articlelist[i].convertdate = util.date_format(articlelist[i].post_date,false,false);  
			} 
		}
	 	if(puretext){
	 		for(i = 0 ; i < articlelist.length ; i++ ){ 
	 			articlelist[i].purecontent = util.delHtmlTag(articlelist[i].content);   
	 		} 
	 	}
	 	cb(err,articlelist); 
 	}) 
}
//更新文章信息
var updateArticleInfo = function(condition,update,options,cb){ 
	Article.update(condition,update, options,cb); 
}

//获取最大的TID
var getMaxTid = function(cb){ 
	var tid = 0;
 	Article.findOne().sort({'tid':-1}).exec(function(err,maxarticle){  
 		if(maxarticle){ 
 			tid = maxarticle.tid + 1;  
 		}
 		cb(err,tid);
 	})
 }

//添加
var saveNewArticle = function(tid,title,content,uid,_creator,flag,cb){
	var articleItem = new Article({ 
 			tid:tid,
 			title:title,
 			content:content,
 			uid:uid,
 			_creator:_creator,
 			flag:flag,
 			isdelete:false
 		});  
	articleItem.save(cb);
}
//添加
var saveNewArticleAsObject = function(articleObj,cb){	
	articleObj.save(cb);
}
//添加
var saveNewArticleWithClassify = function(tid,title,content,uid,_creator,classify,cb){
	var articleItem = new Article({ 
 			tid:tid,
 			title:title,
 			content:content,
 			uid:uid,
 			_creator:_creator,
 			classify:classify,
 			isdelete:false
 		});  
	articleItem.save(cb);
}
//添加
var saveNewArticleWithType = function(tid,content,uid,_creator,type,flag,cb){
	var articleItem = new Article({ 
 			tid:tid, 
 			content:content,
 			uid:uid,
 			_creator:_creator,
 			type:type,
 			flag:flag,
 			isdelete:false
 		});  
	articleItem.save(cb);
}
//添加
var saveNewArticleWithLocation = function(tid,title,content,uid,_creator,flag,location,cb){
	var articleItem = new Article({ 
 			tid:tid,
 			title:title,
 			content:content,
 			uid:uid,
 			_creator:_creator,
 			flag:flag,
			location:location,
 			isdelete:false
 		});  
	articleItem.save(cb);
}

//删除
var deleteArticleByTid = function(tid,cb){
	var condition = {tid:tid};
	var update = {isdelete:true}
	var options = { multi: true }; 
	Article.update(condition,update, options,cb);  
}

exports.getArticleByTid = getArticleByTid;
exports.getNumberOfArticlesAsObect = getNumberOfArticlesAsObect;
exports.getNumberOfArticlesByUid = getNumberOfArticlesByUid;
exports.getNumberOfArticlesByUsername = getNumberOfArticlesByUsername;
exports.getArticleListLimitAsObject = getArticleListLimitAsObject;
exports.getArticleListLimitByUid = getArticleListLimitByUid;
exports.updateArticleInfo = updateArticleInfo;
exports.getNumberByContent = getNumberByContent;
exports.getMaxTid = getMaxTid;

exports.saveNewArticleAsObject = saveNewArticleAsObject;
exports.saveNewArticle = saveNewArticle;
exports.saveNewArticleWithClassify = saveNewArticleWithClassify;
exports.saveNewArticleWithLocation = saveNewArticleWithLocation;
exports.saveNewArticleWithType = saveNewArticleWithType;
exports.deleteArticleByTid = deleteArticleByTid;



