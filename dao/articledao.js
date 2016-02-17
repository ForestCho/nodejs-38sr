var Article = require('../models/article'); 
var UserDao = require('../dao/userdao'); 
var	util = require('../lib/util');

/**
 * [getArticleByTid 通过tid得到文章]
 * @param  {[type]}   tid
 * @param  {Function} cb
 * @return {[type]}
 */
var getArticleByTid = function(tid,cb){
	Article.findOne({tid:tid,isdelete:false}).populate('_creator').exec(cb)
}

/**
 * [getNumberOfArticlesAsObect 通过Object得到文章的数量]
 * @param  {[type]}   articleLimit
 * @param  {Function} cb
 * @return {[type]}
 */
var getNumberOfArticlesAsObect = function(articleLimit,cb){
 	Article.count(articleLimit,cb);
}

/**
 * [getNumberOfArticlesByUid 通过用户UID文章的数量]
 * @param  {[type]}   uid
 * @param  {Function} cb
 * @return {[type]}
 */
var getNumberOfArticlesByUid = function(uid,cb){
 	Article.count({uid:uid,isdelete:false},cb);
}

/**
 * [getNumberOfArticlesByUsername 通过用户名获取文章的数量]
 * @param  {[type]}   username
 * @param  {Function} cb
 * @return {[type]}
 */
var getNumberOfArticlesByUsername = function(username,cb){
	UserDao.getUserInfoByName(username,function(err,doc){
	 	Article.count({uid:doc.uid,isdelete:false},cb);
	});
}

/**
 * [getNumberByContent 搜索内容获取数量]
 * @param  {[type]}   content
 * @param  {Function} cb
 * @return {[type]}
 */
var getNumberByContent = function(content,cb){
	var searchStr = new RegExp(content);
 	Article.count({content:searchStr},cb);
}

/**
 * [getArticleListLimitAsObject 通过json获取文章]
 * @param  {[type]}   puretext
 * @param  {[type]}   pageid
 * @param  {[type]}   pagesize
 * @param  {[type]}   articleLimit
 * @param  {Function} cb
 * @return {[type]}
 */
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

/**
 * [getArticleListLimitByUid 文章用户的数量]
 * @param  {[type]}   puretext
 * @param  {[type]}   pageid
 * @param  {[type]}   pagesize
 * @param  {[type]}   flag
 * @param  {[type]}   uid
 * @param  {[type]}   truetimetype
 * @param  {Function} cb
 * @return {[type]}
 */
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

/**
 * [updateArticleInfo 更新文章信息]
 * @param  {[type]}   condition
 * @param  {[type]}   update
 * @param  {[type]}   options
 * @param  {Function} cb
 * @return {[type]}
 */
var updateArticleInfo = function(condition,update,options,cb){ 
	Article.update(condition,update, options,cb); 
}

/**
 * [getMaxTid 获取最大的TID]
 * @param  {Function} cb
 * @return {[type]}
 */
var getMaxTid = function(cb){ 
	var tid = 0;
 	Article.findOne().sort({'tid':-1}).exec(function(err,maxarticle){  
 		if(maxarticle){ 
 			tid = maxarticle.tid + 1;  
 		}
 		cb(err,tid);
 	})
 }

/**
 * [saveNewArticle 添加]
 * @param  {[type]}   tid
 * @param  {[type]}   title
 * @param  {[type]}   content
 * @param  {[type]}   uid
 * @param  {[type]}   _creator
 * @param  {[type]}   flag
 * @param  {Function} cb
 * @return {[type]}
 */
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

/**
 * [saveNewArticleAsObject 添加]
 * @param  {[type]}   articleObj
 * @param  {Function} cb
 * @return {[type]}
 */
var saveNewArticleAsObject = function(articleObj,cb){	
	articleObj.save(cb);
} 

/**
 * [saveNewArticleWithClassify 添加]
 * @param  {[type]}   tid
 * @param  {[type]}   title
 * @param  {[type]}   content
 * @param  {[type]}   uid
 * @param  {[type]}   _creator
 * @param  {[type]}   classify
 * @param  {Function} cb
 * @return {[type]}
 */
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

/**
 * [saveNewArticleWithType 添加]
 * @param  {[type]}   tid
 * @param  {[type]}   content
 * @param  {[type]}   uid
 * @param  {[type]}   _creator
 * @param  {[type]}   type
 * @param  {[type]}   flag
 * @param  {Function} cb
 * @return {[type]}
 */
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

/**
 * [saveNewArticleWithLocation 添加]
 * @param  {[type]}   tid
 * @param  {[type]}   title
 * @param  {[type]}   content
 * @param  {[type]}   uid
 * @param  {[type]}   _creator
 * @param  {[type]}   flag
 * @param  {[type]}   location
 * @param  {Function} cb
 * @return {[type]}
 */
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

/**
 * [deleteArticleByTid 删除]
 * @param  {[type]}   tid
 * @param  {Function} cb
 * @return {[type]}
 */
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



