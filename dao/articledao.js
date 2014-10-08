var Article = require('../models/article'); 
var	util = require('../lib/util');

//得到文章
var getArticleByTid = function(tid,cb){
		Article.findOne({tid:tid}).populate('_creator').exec(cb)
}
//文章的数量
var getNumberOfArticles = function(flag,cb){
 	Article.count({flag:flag},cb);
}

var getNumberByContent = function(content,cb){
	var searchStr = new RegExp(content);//body-post,query-get
 	Article.count({content:searchStr},cb);
}

//文章的数量
var getArticleListLimit = function(puretext,pageid,pagesize,flag,cb){
 	Article.find({flag:flag}).sort({'post_date':-1}).skip((pageid-1)*pagesize).limit(pagesize).populate('_creator').exec(function(err,articlelist){
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

var updateArticleInfo = function(condition,update,options,cb){ 
	Article.update(condition,update, options,cb); 
}


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
 			flag:flag
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
 			flag:flag
 		});  
	articleItem.save(cb);
}


//删除
var deleteArticleByTid = function(tid,cb){
	var condition = {tid:tid};
	Article.remove(condition,cb);
}

exports.getArticleByTid = getArticleByTid;
exports.getNumberOfArticles = getNumberOfArticles;
exports.getArticleListLimit = getArticleListLimit;
exports.updateArticleInfo = updateArticleInfo;
exports.getNumberByContent = getNumberByContent;
exports.getMaxTid = getMaxTid;
exports.saveNewArticle = saveNewArticle;
exports.saveNewArticleWithType = saveNewArticleWithType;
exports.deleteArticleByTid = deleteArticleByTid;



