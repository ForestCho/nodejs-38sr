var http = require('http');
var cheerio = require('cheerio');  
var EventProxy = require('eventproxy'); 
var moment = require('moment'); 
var mongoose = require('mongoose'); 
var async = require('async');
var async1 = require('async');

//mongoose.connect('mongodb://107.170.206.235:27017/blogdb');

 mongoose.connect('mongodb://localhost/blogdb'); 


 
var baseUrl = "http://112.94.161.30/busiqry/user-card-balance!otherBalanceQry.action?openid=oKYOJjrmYzlhXoYcI0wEPKJOfhek&cardno=0461064439";//qiongrenqiongshi  
 
 
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

var crawl = function(){ 
  ep.assign('html',function(html){
    $ = cheerio.load(html); 
    var tablewrap = $(".btn-blue");
    var resulthtml = tablewrap.text();//[0].chirldren[0]); 
    var id = resulthtml.substring(resulthtml.indexOf("卡号")+3,resulthtml.indexOf("数据")).trim();
    var time = resulthtml.substring(resulthtml.indexOf("时间")+3,resulthtml.indexOf("余额")).trim();
    var remain = resulthtml.substring(resulthtml.indexOf("元）")+3).trim();
    console.log(id);
    console.log(time);
    console.log(remain);
  });
  console.log("ccccc");
  get(baseUrl,function(err,data){
    var html;
    if(data != null){
      html = data.toString();
    }
    ep.emit('html',html);
  });
} 
 

crawl(); 