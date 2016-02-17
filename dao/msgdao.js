var Message = require('../models/message'); 
var User = require('../models/user'); 
var Article = require('../models/article'); 
var Reply = require('../models/reply'); 

/**
 * [getDetailMessageById 通过id获取消息的详细]
 * @param  {[type]}   id
 * @param  {Function} callback
 * @return {[type]}
 */
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

/**
 * [getMessageByUid 通过UID获取消息]
 * @param  {[type]}   uid
 * @param  {[type]}   isread
 * @param  {Function} callback
 * @return {[type]}
 */
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

/**
 * [getCountOfMessageByUid 通过UID获取消息数量]
 * @param  {[type]}   uid
 * @param  {[type]}   isread
 * @param  {Function} callback
 * @return {[type]}
 */
exports.getCountOfMessageByUid = function(uid,isread,callback){ 
	Message.count({refuid:uid,isread:isread},function(err,count){
		callback(err,count)
	});
};
 
/**
 * [saveReplyMsg 保存回复]
 * @param  {[type]}   uid
 * @param  {[type]}   refuid
 * @param  {[type]}   tid
 * @param  {[type]}   rid
 * @param  {Function} callback
 * @return {[type]}
 */
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

/**
 * [saveAtMsg 保存AT信息]
 * @param  {[type]}   uid
 * @param  {[type]}   refuid
 * @param  {[type]}   tid
 * @param  {[type]}   rid
 * @param  {Function} callback
 * @return {[type]}
 */
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
 
/**
 * [saveFollowMsg 保存关注信息]
 * @param  {[type]}   uid
 * @param  {[type]}   refuid
 * @param  {Function} callback
 * @return {[type]}
 */
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
