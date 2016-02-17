var Like = require('../models/like');
 
/**
 * [getLikeNumByUidAndTid 获取赞的数量]
 * @param  {[type]}   uid
 * @param  {[type]}   tid
 * @param  {Function} cb
 * @return {[type]}
 */
var getLikeNumByUidAndTid = function(uid,tid,cb){	
	Like.count({uid:uid,tid:tid},cb)
} 

/**
 * [saveNewLike 保存赞]
 * @param  {[type]}   uid
 * @param  {[type]}   tid
 * @param  {[type]}   islike
 * @param  {Function} cb
 * @return {[type]}
 */
var saveNewLike = function(uid,tid,islike,cb){
	var like = new Like({
 		uid:uid,
 		tid:tid,
 		islike:islike
 	}); 
 	like.save(cb);
}
 

exports.getLikeNumByUidAndTid = getLikeNumByUidAndTid;
exports.saveNewLike = saveNewLike;