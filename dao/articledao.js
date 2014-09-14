var Article = require('../models/article'); 
var	util = require('../lib/util');

//得到文章
var getArticleByTid = function(tid,cb){
		Article.findOne({tid:tid}).populate('_creator').exec(cb)
}
//文章的数量
var getNumberOfArticles = function(cb){
 	Article.count({},cb);
}

//文章的数量
var getArticleListLimit = function(pageid,pagesize,cb){
 	Article.find({}).sort({'post_date':-1}).skip((pageid-1)*pagesize).limit(pagesize).populate('_creator').exec(function(err,articlelist){
		var temp ="";
		var temp1 ="";
	 	for(i = 0 ; i < articlelist.length ; i++ ){ 
	 		articlelist[i].convertdate = util.date_format(articlelist[i].post_date,true,true);  
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
var saveNewArticle = function(tid,title,content,uid,_creator,cb){
	var articleItem = new Article({ 
 			tid:tid,
 			title:title,
 			content:content,
 			uid:uid,
 			_creator:_creator
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
exports.getMaxTid = getMaxTid;
exports.saveNewArticle = saveNewArticle;
exports.deleteArticleByTid = deleteArticleByTid;

