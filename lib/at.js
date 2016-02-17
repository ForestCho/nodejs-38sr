var User = require('../models/user'); 
var Msgdao = require('../dao/msgdao'); 
 
/**
 * [fetchUsers 从文本中提取出@username 标记的用户名数组]
 * @param  {[type]} text 文本内容
 * @return {[type]} 用户名数组
 */
var fetchUsers = function (text) {
  var results = text.match(/@[\u4E00-\u9FA5a-zA-Z0-9\-_]+/ig);
  var names = [];
  if (results) {
    for (var i = 0, l = results.length; i < l; i++) {
      var s = results[i];
      //remove char @
      s = s.slice(1);
      names.push(s);
    }
  }
  return names;
};

/**
 * [sendMessageToMentionUsers description]
 * @param  {[type]}   text
 * @param  {[type]}   tid
 * @param  {[type]}   refid
 * @param  {[type]}   rid
 * @param  {Function} callback
 * @return {[type]}
 */
exports.sendMessageToMentionUsers = function (text, tid, refid, rid, callback) {
  if (typeof rid === 'function') {
    callback = rid;
    rid = null;
  }
  callback = callback || function () {};
  User.find({name: { $in: fetchUsers(text)}}, function (err, users) {
    if (err || !users) {
      return callback(err);
    }
    var ep = new EventProxy();
    ep.after('sent', users.length, function () {
      callback();
    }).fail(callback); 
    users.forEach(function (user) {  
      Msgdao.saveAtMsg(user.uid, refid, tid, rid, function(err){
        if(!err){
          ep.emit('sent')
        }
      });
    });
  });
};
 
/**
 * [linkUsers 根据文本内容，替换为数据库中的数据]
 * @param  {[type]}   text 文本内容
 * @param  {Function} callback 回调函数
 * @return {[type]}
 */
exports.linkUsers = function (text, callback) {
  User.find({name: { $in: fetchUsers(text)}}, function (err, users) {
    if (err) {
      return callback(err);
    }
    for (var i = 0, l = users.length; i < l; i++) {
      var name = users[i].name;
      text = text.replace(new RegExp('@' + name + '(?!\s*\\])', 'gmi'), '<a href="/user/' + name + '">@' + name + '</a>'); 
    }
    return callback(null, text);
  });
};

/**
 * [linkUsersWithName description]
 * @param  {[type]}   text
 * @param  {Function} callback
 * @return {[type]}
 */
exports.linkUsersWithName = function (text, callback) {
	  console.log(text);
  User.find({name: { $in: fetchUsers(text)}}, function (err, users) {
    if (err) {
      return callback(err);
    }
	  console.log(users);
    for (var i = 0, l = users.length; i < l; i++) {
      var name = users[i].name;
      text = text.replace(new RegExp('@' + name + '(?!\s*\\])', 'gmi'), '' );  
     // text = text.replace(new RegExp('@' + name + '(?!\s*\\])', 'gmi'), '回复' + name );  
    }
    return callback(null, text);
  });
};