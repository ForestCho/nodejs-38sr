var Reply = require('../models/reply'); 

var getReplyByTid = function(tid,cb){
	Reply.find({tid:tid}).populate('_creator').exec(cb);
}

exports.getReplyByTid = getReplyByTid;