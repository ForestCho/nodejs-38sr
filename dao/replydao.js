var Reply = require('../models/reply'); 
 
/**
 * [getReplyByTid 获取回复]
 * @param  {[type]}   tid
 * @param  {Function} cb
 * @return {[type]}
 */
var getReplyByTid = function(tid,cb){
	Reply.find({tid:tid}).sort({'create_at':-1}).populate('_creator').lean(true).exec(cb);
}

/**
 * [getReplyByTidLimit 获取回复]
 * @param  {[type]}   tid
 * @param  {[type]}   num
 * @param  {Function} cb
 * @return {[type]}
 */
var getReplyByTidLimit = function(tid,num,cb){
	Reply.find({tid:tid}).sort({'create_at':-1}).populate('_creator').limit(num).lean(true).exec(cb);
}

/**
 * [getReplyByAsObject 获取回复]
 * @param  {[type]}   replyLimit
 * @param  {Function} cb
 * @return {[type]}
 */
var getReplyByAsObject = function(replyLimit,cb){
	Reply.find(replyLimit).sort({'create_at':1}).populate('_creator').lean(true).exec(cb);	
}
exports.getReplyByTid = getReplyByTid;
exports.getReplyByAsObject = getReplyByAsObject;
exports.getReplyByTidLimit = getReplyByTidLimit;