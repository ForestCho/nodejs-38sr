var Reply = require('../models/reply'); 

var getReplyByTid = function(tid,cb){
	Reply.find({tid:tid}).populate('_creator').lean(true).exec(cb);
}

exports.getReplyByTid = getReplyByTid;