var crypto = require('crypto');
var querystring = require('querystring');
var nodemailer = require('nodemailer');
var xss = require('xss');
config = require('../config').config;
 
var send_mail = function(usermail,subject,content,callback){
	var transport = nodemailer.createTransport("SMTP",{
		host:config.mailhost.host,
		secureConnection:config.mailhost.secureConnection,
		port:config.mailhost.port,
		auth: {
			user:config.mailhost.auth.user,
			pass: config.mailhost.auth.pass
		}
	});
	transport.sendMail({
		from: config.mailhost.auth.user ,
		to:usermail,
		subject: subject,
		generateTextFromHTML : true,
		html : content
	},callback); 
};

var get_gravatar =  function (email, options, https) {
	var baseURL = (https && "https://secure.gravatar.com/avatar/") || 'http://www.gravatar.com/avatar/';
	var queryData = querystring.stringify(options);
	var query = (queryData && "?" + queryData) || "";
	return baseURL + crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex') + query;
};
var getStartOfCurrDay = function(date){	
	var year = date.getFullYear();
	var month = date.getMonth() ;
	var day = date.getDate();  
	return new Date(year,month,day,0,0,0);
}
var getEndOfCurrDay = function(date){	
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate(); 
	return new Date(year,month,day+1,0,0,0);
}
var date_format = function(date,iswithnow,isNeedHourMinute){
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var now = new Date();
	if(iswithnow){
		var mseconds = now.getTime() - date.getTime();
		var time_group = [1000, 60*1000, 60*60*1000, 24*60*60*1000];
		if(mseconds<time_group[3]){
			if(mseconds > time_group[0] && mseconds < time_group[1]){
				return Math.floor(mseconds/time_group[0]).toString()+'秒前';
			}
			if(mseconds > time_group[1] && mseconds < time_group[2]){
				return Math.floor(mseconds/time_group[1]).toString()+'分前';
			}
			if(mseconds > time_group[2] && mseconds < time_group[3]){
				return Math.floor(mseconds/time_group[2]).toString()+'时前';
			}
		}		
	}
	var dateStr ;
	if(isNeedHourMinute){//display completee date [year/not month day hour minute]
		year = (now.getFullYear() === year)? '':(year+'年') 
		dateStr =  month +'月'+ day + '日' + hour + '时' + minute +'分';
	}else{//display completee date [year month day]
		dateStr = month +'月'+ day + '日';
	}
	return dateStr
}

var md5_str = function(str){
	var md5 = crypto.createHash('md5');
	md5.update(str);
	return md5.digest('hex');
} ;



var random_string = function(length) {
	var alpha_num_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
	if (! length) {
		length = Math.floor(Math.random() * alpha_num_chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += alpha_num_chars[Math.floor(Math.random() * alpha_num_chars.length)];
	}
	return str;
} ;

function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

function decrypt(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/**
 * XSS模块配置
 */
var xssOptions = {
  whiteList: {
    h1:     [],
    h2:     [],
    h3:     [],
    h4:     [],
    h5:     [],
    h6:     [],
    hr:     [],
    span:   [],
    strong: [],
    b:      [],
    i:      [],
    br:     [],
    p:      [],
    pre:    ['class'],
    code:   [],
    a:      ['target', 'href', 'title'],
    img:    ['src', 'alt', 'title'],
    div:    [],
    table:  ['width', 'border'],
    tr:     [],
    td:     ['width', 'colspan'],
    th:     ['width', 'colspan'],
    tbody:  [],
    thead:  [],
    ul:     [],
    li:     [],
    ol:     [],
    dl:     [],
    dt:     [],
    em:     [],
    cite:   [],
    section: [],
    header: [],
    footer: [],
    blockquote: [],
    audio:  ['autoplay', 'controls', 'loop', 'preload', 'src'],
    video:  ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width']
  }
};

/**
 * 过滤XSS攻击代码
 *
 * @param {string} html
 * @return {string}
 */
var  getxss = function (html) {
  return xss(html, xssOptions);
};


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