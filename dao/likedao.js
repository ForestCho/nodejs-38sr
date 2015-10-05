var Like = require('../models/like');

var getLikeNumByUidAndTid = function(uid,tid,cb){	
	Like.count({uid:uid,tid:tid},cb)
} 

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