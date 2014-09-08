var User = require('../models/user'); 
var MessageDao = require('../dao/messagedao'); 

/**
 * 从文本中提取出@username 标记的用户名数组
 * @param {String} text 文本内容
 * @return {Array} 用户名数组
 */
var fetchUsers = function (text) {
  var results = text.match(/@[a-zA-Z0-9\-_]+/ig);
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
      MessageDao.saveAtMsg(user.uid, refid, tid, rid, function(err){
        if(!err){
          ep.emit('sent')
        }
      });
    });
  });
};

/**
 * 根据文本内容，替换为数据库中的数据
 * Callback:
 * - err, 数据库异常
 * - text, 替换后的文本内容
 * @param {String} text 文本内容
 <a href="/user/name">@name</a>
 * @param {Function} callback 回调函数
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