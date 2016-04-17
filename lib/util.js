var crypto = require('crypto');
var http = require('http');
var querystring = require('querystring');
var nodemailer = require('nodemailer');
var xss = require('xss');
config = require('../config').config;


/**
 * [get 获取网路数据]
 * @param  {[type]}   url
 * @param  {Function} cb
 * @return {[type]}
 */
var get = function(url, cb) {
  http.get(url, function(res) {
    var size = 0;
    var chunks = [];
    res.on('data', function(chunk) {
      size += chunk.length;
      chunks.push(chunk);
    });
    res.on('end', function() {
      var data = Buffer.concat(chunks, size);
      cb(null, data);
    });
  }).on('error', function(e) {
    cb(e, null);
  });
}

/**
 * [send_mail 发送邮件]
 * @param  {[type]}   usermail
 * @param  {[type]}   subject
 * @param  {[type]}   content
 * @param  {Function} callback
 * @return {[type]}
 */
var send_mail = function(usermail, subject, content, callback) {
  var transport = nodemailer.createTransport("SMTP", {
    host: config.mailhost.host,
    secureConnection: config.mailhost.secureConnection,
    port: config.mailhost.port,
    auth: {
      user: config.mailhost.auth.user,
      pass: config.mailhost.auth.pass
    }
  });
  transport.sendMail({
    from: config.mailhost.auth.user,
    to: usermail,
    subject: subject,
    generateTextFromHTML: true,
    html: content
  }, callback);
};


/**
 * [get_gravatar 获取头像]
 * @param  {[type]} email
 * @param  {[type]} options
 * @param  {[type]} https
 * @return {[type]}
 */
var get_gravatar = function(email, options, https) {
  var baseURL = (https && "https://secure.gravatar.com/avatar/") || 'http://www.gravatar.com/avatar/';
  var queryData = querystring.stringify(options);
  var query = (queryData && "?" + queryData) || "";
  return baseURL + crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex') + query;
};

/**
 * [getStartOfCurrDay 得到一天开始的时间]
 * @param  {[type]} date
 * @return {[type]}
 */
var getStartOfCurrDay = function(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  return new Date(year, month, day, 0, 0, 0);
}

/**
 * [getEndOfCurrDay 得到一天结束的时间]
 * @param  {[type]} date
 * @return {[type]}
 */
var getEndOfCurrDay = function(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  return new Date(year, month, day + 1, 0, 0, 1);
}

/**
 * [date_format 时间格式format]
 * @param  {[type]}  date
 * @param  {[type]}  iswithnow
 * @param  {Boolean} isNeedHourMinute
 * @return {[type]}
 */
var date_format = function(date, iswithnow, isNeedHourMinute) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var now = new Date();
  if (iswithnow) {
    var mseconds = now.getTime() - date.getTime();
    var time_group = [1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000, 2 * 24 * 60 * 60 * 1000, 3 * 24 * 60 * 60 * 1000, 4 * 24 * 60 * 60 * 1000, 5 * 24 * 60 * 60 * 1000, 6 * 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000, 8 * 24 * 60 * 60 * 1000];
    if (mseconds < time_group[10]) {
      if (mseconds > time_group[0] && mseconds < time_group[1]) {
        return Math.floor(mseconds / time_group[0]).toString() + '秒前';
      }
      if (mseconds > time_group[1] && mseconds < time_group[2]) {
        return Math.floor(mseconds / time_group[1]).toString() + '分钟前';
      }
      if (mseconds > time_group[2] && mseconds < time_group[3]) {
        return Math.floor(mseconds / time_group[2]).toString() + '小时前';
      }
      if (mseconds > time_group[3] && mseconds < time_group[10]) {
        return Math.floor(mseconds / time_group[3]).toString() + '天前';
      }
    }
  }
  var dateStr;
  if (isNeedHourMinute) { //display completee date [year/not month day hour minute]
    year = (now.getFullYear() === year) ? '' : (year + '年');
    dateStr = year + month + '-' + day + ' ' + hour + ':' + minute;
  } else { //display completee date [year month day]
    dateStr = year + '-' + month + '-' + day + ' ';
  }
  return dateStr
}

/**
 * [md5_str md5加密 ]
 * @param  {[type]} str
 * @return {[type]}
 */
var md5_str = function(str) {
  var md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex');
};

/**
 * [random_string 随即字符串]
 * @param  {[type]} length
 * @return {[type]}
 */
var random_string = function(length) {
  var alpha_num_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
  if (!length) {
    length = Math.floor(Math.random() * alpha_num_chars.length);
  }

  var str = '';
  for (var i = 0; i < length; i++) {
    str += alpha_num_chars[Math.floor(Math.random() * alpha_num_chars.length)];
  }
  return str;
};

/**
 * [encrypt 加密]
 * @param  {[type]} str
 * @param  {[type]} secret
 * @return {[type]}
 */
function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

/**
 * [decrypt 解密 ]
 * @param  {[type]} str
 * @param  {[type]} secret
 * @return {[type]}
 */
function decrypt(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/**
 * [xssOptions XSS模块配置]
 * @type {Object}
 */
var xssOptions = {
  whiteList: {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    hr: [],
    span: [],
    strong: [],
    b: [],
    i: [],
    br: [],
    p: [],
    pre: ['class'],
    code: [],
    a: ['target', 'href', 'title'],
    img: ['src', 'alt', 'title'],
    div: [],
    table: ['width', 'border'],
    tr: [],
    td: ['width', 'colspan'],
    th: ['width', 'colspan'],
    tbody: [],
    thead: [],
    ul: [],
    li: [],
    ol: [],
    dl: [],
    dt: [],
    em: [],
    cite: [],
    section: [],
    header: [],
    footer: [],
    blockquote: [],
    audio: ['autoplay', 'controls', 'loop', 'preload', 'src'],
    video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width']
  }
};

/**
 * [getxss 过滤XSS攻击代码
 * @param  {[type]} html
 * @return {[type]}
 */
var getxss = function(html) {
  return xss(html, xssOptions);
};

/**
 * [delHtmlTag 删除html标签]
 * @param  {[type]} str
 * @return {[type]}
 */
var delHtmlTag = function(str) {
  htmlStr = str.replace(/<[^>]+>/g, " "); //去掉所有的html标记
  return htmlStr.replace(/&nbsp;/g, "");
}

/**
 * [getDomain 通过链接获取域名
 ]
 * @param  {[type]} url
 * @return {[type]}
 */
var getDomain = function(url) {
  var urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
  var url = urlReg.exec(url);
  return url[0];
}

/**
 * [getIndex description]
 * @param  {[type]} str
 * @param  {[type]} num
 * @return {[type]}
 */
function getIndex(str, num) { //在IE8 兼容性模式下 不会报错  
  var s = 0;
  var i = 0
  for (; i < str.length; i++) {
    if (str.charAt(i).match(/[\u0391-\uFFE5]/)) {
      s += 2;
    } else {
      s++;
    }
    if (s > num) {
      break;
    }
  }
  return i;
}

/**
 * [getSize description]
 * @param  {[type]} str
 * @return {[type]}
 */
function getSize(str) { //在IE8 兼容性模式下 不会报错  
  var s = 0;
  var i = 0
  for (; i < str.length; i++) {
    if (str.charAt(i).match(/[\u0391-\uFFE5]/)) {
      s += 2;
    } else {
      s++;
    }
  }
  return s;
}

/**
 * [getFirstSentence description]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function getFirstSentence(str) {
  var a = str.indexOf(',');
  var temp = '';
  if (a < 0) {
    var b = str.indexOf('、');
    if (b < 0) {
      var c = str.indexOf(';');
      if (c < 0) {
        var d = str.indexOf('？');
        if (d < 0) {
          var e = str.indexOf('，');
          if (e < 0) {
            var f = str.indexOf('。');
            if(f<0){
              var g = str.indexOf(',');
              if(g<0){
                var h = str.indexOf(' ');
                if(h<0){
                  temp = str.substr(0, 28);
                }else{
                  temp = str.substr(0, g);
                }  
              }else{
                temp = str.substr(0, g);
              } 
            }else{
              temp = str.substr(0, f);
            }
          } else {
            temp = str.substr(0, e);
          }
        } else { 
          temp = str.substr(0, d);
        }
      } else {
        temp = str.substr(0, c);
      }
    } else {
      temp = str.substr(0, b);
    }
  } else {
    temp = str.substr(0, a);
  } 

  return temp;
}

exports.get = get;
exports.get_gravatar = get_gravatar;
exports.date_format = date_format;
exports.md5_str = md5_str;
exports.send_mail = send_mail;
exports.random_string = random_string;
exports.getStartOfCurrDay = getStartOfCurrDay;
exports.getEndOfCurrDay = getEndOfCurrDay;

exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.xss = getxss;
exports.delHtmlTag = delHtmlTag;
exports.getDomain = getDomain;


exports.getSize = getSize;
exports.getIndex = getIndex;
exports.getFirstSentence = getFirstSentence;