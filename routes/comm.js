var	UserDao = require('../dao/userdao'); 
var	ArticleDao = require('../dao/articledao'); 
var	ReplyDao = require('../dao/replydao'); 
var util = require('../lib/util'); 
var at = require('../lib/at'); 
var relationdao = require('../dao/relationdao'); 
var EventProxy = require('eventproxy'); 
var http = require('http');
var cheerio = require('cheerio');  
var iconv = require('iconv-lite');
/*
 * GET article detail page.
 */
exports.view = function (req, res) {
 	res.render('comm', { title: 'comm' });
  }; 

 exports.index = function (req, res) {
 	var commstr = req.query.commstr;   
 	var baseUrl = "http://baike.c114.net/view.asp?id=16518-DB272B81&word=";//qiongrenqiongshi  
	ep.assign('html',function(html){  
	    $ = cheerio.load(html); 
	    var tablewrap = $(".box2");
	    var resulthtml = tablewrap.text();//[0].chirldren[0]); 
	    var content = resulthtml.trim();
	    var info = {};  
	    info.content =  content;     	
 		res.json(info);   
	  }); 
	  get(baseUrl+commstr,function(err,data){
	    var html;
	    if(data != null){
	      html = data.toString();
	    }
	    ep.emit('html',html);
	  });
 }; 

 var ep = new EventProxy();

//定义一个爬去方法
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
 