var Site = require('../models/site'); 
var	util = require('../lib/util');
  
/**
 * [saveNewSite 添加新的Site ]
 * @param  {[type]}   siteObj
 * @param  {Function} cb
 * @return {[type]}
 */
var saveNewSite = function(siteObj,cb){ 
	siteObj.save(cb);
}
 
/**
 * [getMaxSid 得到Sid最大的Site]
 * @param  {Function} cb
 * @return {[type]}
 */
var getMaxSid = function(cb){ 
	var sid = 0;
 	Site.findOne().sort({'sid':-1}).exec(function(err,maxsite){  
 		if(maxsite){ 
 			sid = maxsite.sid + 1;  
 		}
 		cb(err,sid);
 	})
}
 
/**
 * [getDefaultSid 获取默认的Sid = 0 的Site]
 * @param  {Function} cb
 * @return {[type]}
 */
var getDefaultSid = function(cb){  
 	Site.findOne().sort({'sid':1}).exec(cb);
} 
/**
 * [getSiteByObj 根据限制获取Site]
 * @param  {[type]}   siteLimit
 * @param  {Function} cb
 * @return {[type]}
 */
var getSiteByObj = function(siteLimit,cb){
	Site.findOne(siteLimit).exec(cb)
}
 
/**
 * [delSiteByObj 根据限制删除Site]
 * @param  {[type]}   siteLimit
 * @param  {Function} cb
 * @return {[type]}
 */
var delSiteByObj = function(siteLimit,cb){
	Site.remove(siteLimit).exec(cb)
}
 
/**
 * [updateSite 更新Site]
 * @param  {[type]}   condition
 * @param  {[type]}   update
 * @param  {[type]}   options
 * @param  {Function} cb
 * @return {[type]}
 */
var updateSite = function(condition,update,options,cb){ 
	Site.update(condition,update,options,cb); 
}

exports.saveNewSite = saveNewSite; 
exports.getMaxSid = getMaxSid; 
exports.getSiteByObj = getSiteByObj;
exports.getDefaultSid = getDefaultSid;
exports.delSiteByObj = delSiteByObj;
exports.updateSite = updateSite;