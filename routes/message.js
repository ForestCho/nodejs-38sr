var util = require('../lib/util');
var MessageDao = require('../dao/messagedao'); 
var EventProxy = require('eventproxy'); 
/*
 * GET user page.
 */

 exports.index = function (req, res,next) {   
 	var uid = req.session.user.uid; 
 	var ep = new EventProxy();

 	ep.all('have_read_msg', 'not_read_msg', function (have_read_msg, not_read_msg) { 

 		for(var i=0;i<have_read_msg.length;i++){
 			have_read_msg[i].createdate = util.date_format(have_read_msg[i].create_date,false,true);
 		}
 		for(var i=0;i<not_read_msg.length;i++){
 			not_read_msg[i].createdate = util.date_format(not_read_msg[i].create_date,false,true);
 		}
 		
 		return	res.render('message', { title:'消息',have_read_msg:have_read_msg,not_read_msg:not_read_msg});  
 	});

 	ep.all('have_read', 'not_read', function (have_read, not_read) {
 		[have_read, not_read].forEach(function (msgs, idx) {
 			var epfill = new EventProxy();
 			epfill.fail(next);
 			epfill.after('message_ready', msgs.length, function (docs) { 
 				ep.emit(idx === 0 ? 'have_read_msg' : 'not_read_msg', docs);
 			});
 			msgs.forEach(function (doc) {
 				MessageDao.getDetailMessageById(doc._id, epfill.group('message_ready'));
 			});
 		});
 	});  

 	MessageDao.getMessageByUid(uid,true,function(err,have_read){
 		ep.emit('have_read',have_read);
 	})

 	MessageDao.getMessageByUid(uid,false,function(err,not_read){
 		ep.emit('not_read',not_read);
 	})
 } 
