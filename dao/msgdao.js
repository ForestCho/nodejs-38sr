var Message = require('../models/message'); 
var User = require('../models/user'); 
var Article = require('../models/article'); 
var Reply = require('../models/reply'); 

exports.getDetailMessageById = function(id,callback){  
	Message.findOne({_id: id}, function (err, message) {
		if (err) {
			return callback(err);
		}
		if (message.type === 'reply' || message.type === 'at') {
			var proxy = new EventProxy();
			proxy.assign('author_found', 'topic_found', 'reply_found', function (author, topic, reply) {
				message.author = author; 
				message.topic = topic;
				message.reply = reply;
				if (!author || !topic) {
					message.is_invalid = true;
				}    
				return callback(null, message);
      }).fail(callback); // 接收异常
			User.findOne({uid:message.uid},proxy.done('author_found')); 
			Article.findOne({tid:message.tid}, proxy.done('topic_found'));
			Reply.findOne({rid:message.rid}, proxy.done('reply_found'));
		}

		if (message.type === 'follow') {
			User.findOne({uid:message.uid}, function (err, author) {
				if (err) {
					return callback(err);
				}
				message.author = author;
				if (!author) {
					message.is_invalid = true;
				}
				return callback(null, message);
			});
		}
	});
};

exports.getMessageByUid = function(uid,isread,callback){ 
	Message.find({refuid:uid,isread:isread}).sort({'create_date':-1}).limit(20).exec(function(err,msglist){
		if(err){
			callback(err)
			return ;
		}
		if(isread === false){
			msglist.forEach(function(msg){
				msg.isread = true;
				msg.save();
			})
		}
		callback(null,msglist);
	});
};

exports.getCountOfMessageByUid = function(uid,isread,callback){ 
	Message.count({refuid:uid,isread:isread},function(err,count){
		callback(err,count)
	});
};

exports.saveReplyMsg = function(uid,refuid,tid,rid,callback){ 
	var msg = new Message({
		type:'reply',
		uid:uid,
		refuid:refuid,
		tid:tid,
		rid:rid
	});
	msg.save(function(err){ 
		callback(err);
	});
};

exports.saveAtMsg = function(uid,refuid,tid,rid,callback){ 
	var msg = new Message({
		type:'at',
		uid:uid,
		refuid:refuid,
		tid:tid,
		rid:rid
	});
	msg.save(function(err){ 
		callback(err);
	});
};

exports.saveFollowMsg = function(uid,refuid,callback){ 
	var msg = new Message({
		type:'follow',
		uid:uid,
		refuid:refuid
	});
	msg.save(function(err){ 
		callback(err);
	});
};
