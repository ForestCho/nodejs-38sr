var Site = require('../models/site'); 
var	util = require('../lib/util');
 
//添加新的Site
var saveNewSite = function(siteObj,cb){ 
	siteObj.save(cb);
}

//得到Sid最大的Site
var getMaxSid = function(cb){ 
	var sid = 0;
 	Site.findOne().sort({'sid':-1}).exec(function(err,maxsite){  
 		if(maxsite){ 
 			sid = maxsite.sid + 1;  
 		}
 		cb(err,sid);
 	})
}

//获取默认的Sid = 0 的Site
var getDefaultSid = function(cb){  
 	Site.findOne().sort({'sid':1}).exec(cb);
}
//根据限制获取Site
var getSiteByObj = function(siteLimit,cb){
	Site.findOne(siteLimit).exec(cb)
}

//根据限制删除Site
var delSiteByObj = function(siteLimit,cb){
	Site.remove(siteLimit).exec(cb)
}

//更新Site
var updateSite = function(condition,update,options,cb){ 
	Site.update(condition,update,options,cb); 
}

exports.saveNewSite = saveNewSite; 
exports.getMaxSid = getMaxSid; 
exports.getSiteByObj = getSiteByObj;
exports.getDefaultSid = getDefaultSid;
exports.delSiteByObj = delSiteByObj;
exports.updateSite = updateSite;