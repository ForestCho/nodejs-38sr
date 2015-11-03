var Reply = require('../models/reply'); 

//获取回复
var getReplyByTid = function(tid,cb){
	Reply.find({tid:tid}).sort({'create_at':-1}).populate('_creator').lean(true).exec(cb);
}
//获取回复
var getReplyByTidLimit = function(tid,num,cb){
	Reply.find({tid:tid}).sort({'create_at':-1}).populate('_creator').limit(num).lean(true).exec(cb);
}
//获取回复
var getReplyByAsObject = function(replyLimit,cb){
	Reply.find(replyLimit).sort({'create_at':1}).populate('_creator').lean(true).exec(cb);	
}
exports.getReplyByTid = getReplyByTid;
exports.getReplyByAsObject = getReplyByAsObject;
exports.getReplyByTidLimit = getReplyByTidLimit;