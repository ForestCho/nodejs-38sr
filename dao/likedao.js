var Like = require('../models/like');

//获取赞的数量
var getLikeNumByUidAndTid = function(uid,tid,cb){	
	Like.count({uid:uid,tid:tid},cb)
} 

//保存赞
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