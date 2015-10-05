var crypto = require('crypto');
var http = require('http');
var querystring = require('querystring');
var nodemailer = require('nodemailer');
var xss = require('xss');
config = require('../config').config;


/*
*获取网路数据
**/ 
var get = function(url, cb){
    http.get(url, function(res) {
        var size = 0;
        var chunks = [];
        res.on('data', function(chunk){
          size += chunk.length;
          chunks.push(chunk);
        });
        res.on('end', function(){
          var data = Buffer.concat(chunks, size);
          cb(null, data);
        });
      }).on('error', function(e) {
        cb(e, null);
    });
}


/*
*发送邮件
**/
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


/*
*获取头像
**/
var get_gravatar =  function (email, options, https) {
	var baseURL = (https && "https://secure.gravatar.com/avatar/") || 'http://www.gravatar.com/avatar/';
	var queryData = querystring.stringify(options);
	var query = (queryData && "?" + queryData) || "";
	return baseURL + crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex') + query;
};

/*
*得到一天开始的时间
**/
var getStartOfCurrDay = function(date){	
	var year = date.getFullYear();
	var month = date.getMonth() ;
	var day = date.getDate();  
	return new Date(year,month,day,0,0,0);
}

/*
*得到一天结束的时间
**/
var getEndOfCurrDay = function(date){	
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate(); 
	return new Date(year,month,day+1,0,0,0);
}

/*
*时间格式format
**/
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
		var time_group = [1000, 60*1000, 60*60*1000, 24*60*60*1000, 2*24*60*60*1000, 3*24*60*60*1000, 4*24*60*60*1000, 5*24*60*60*1000, 6*24*60*60*1000, 7*24*60*60*1000, 8*24*60*60*1000];
		if(mseconds<time_group[10]){
			if(mseconds > time_group[0] && mseconds < time_group[1]){
				return Math.floor(mseconds/time_group[0]).toString()+'秒前';
			}
			if(mseconds > time_group[1] && mseconds < time_group[2]){
				return Math.floor(mseconds/time_group[1]).toString()+'分钟前';
			}
			if(mseconds > time_group[2] && mseconds < time_group[3]){
				return Math.floor(mseconds/time_group[2]).toString()+'小时前';
			}
			if(mseconds > time_group[3] && mseconds < time_group[10]){
				return Math.floor(mseconds/time_group[3]).toString()+'天前';
			}
		}		
	}
	var dateStr ;
	if(isNeedHourMinute){//display completee date [year/not month day hour minute]
		year = (now.getFullYear() === year)? '':(year+'年'); 
		dateStr = year+ month +'-'+ day + ' ' + hour + ':' + minute ;
	}else{//display completee date [year month day]
		dateStr = year + '-'+ month +'-'+ day + ' ';
	}
	return dateStr
}

/*
*md5加密
**/
var md5_str = function(str){
	var md5 = crypto.createHash('md5');
	md5.update(str);
	return md5.digest('hex');
} ;


/*
*随即字符串
**/
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

/*
*加密
**/
function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

/*
*解密
**/
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

/*
*删除html标签
**/
var  delHtmlTag = function(str)
{
	htmlStr =  str.replace(/<[^>]+>/g," ");//去掉所有的html标记
	return htmlStr.replace(/&nbsp;/g, "");
}
/*
*通过链接获取域名
*/
var getDomain = function(url){
	var urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;  
	var url=urlReg.exec(url);  
	return url[0];
}

function getIndex(str,num) { //在IE8 兼容性模式下 不会报错  
    var s = 0;
    var i = 0
    for ( ; i < str.length; i++) { 
        if (str.charAt(i).match(/[\u0391-\uFFE5]/)) {
            s += 2;
        } else {
            s++;
        } 
        if(s > num){
        	break;
        }
    }
    return i;
}

function getSize(str) { //在IE8 兼容性模式下 不会报错  
    var s = 0;
    var i = 0
    for ( ; i < str.length; i++) { 
        if (str.charAt(i).match(/[\u0391-\uFFE5]/)) {
            s += 2;
        } else {
            s++;
        } 
    }
    return s;
}
exports.get  = get;
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