var redis  = require('./redis');
var _      = require('lodash'); 

/**
 * [get description]
 * @param  {[type]}   key
 * @param  {Function} callback
 * @return {[type]}
 */
var get = function (key, callback) {
  var t = new Date();
  redis.get(key, function (err, data) {
    if (err) {
      return callback(err);
    }
    if (!data) {
      return callback();
    }
    data = JSON.parse(data); 
    callback(null, data);
  });
};


/**
 * [set time 参数可选，秒为单位]
 * @param {[type]}   key
 * @param {[type]}   value
 * @param {[type]}   time
 * @param {Function} callback
 */
var set = function (key, value, time, callback) {
  var t = new Date();

  if (typeof time === 'function') {
    callback = time;
    time = null;
  }
  callback = callback || _.noop;
  value = JSON.stringify(value);

  if (!time) {
    redis.set(key, value, callback);
  } else {
    redis.setex(key, time, value, callback);
  } 
};

exports.get = get;
exports.set = set;