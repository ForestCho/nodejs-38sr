var http = require('http');
var cheerio = require('cheerio'); 
var Article = require('../models/article');
var UserDao = require('../dao/userdao'); 
var ArticleDao = require('../dao/articledao');  
var EventProxy = require('eventproxy'); 
var moment = require('moment'); 
var mongoose = require('mongoose'); 
var async = require('async');
var async1 = require('async');
/*
 * GET home page.
 */
//mongoose.connect('mongodb://107.170.206.235:27017/blogdb');

 //mongoose.connect('mongodb://localhost/blogdb'); 
mongoose.connect('mongodb://localhost/blogdb');


var baseUrl1 = "http://weibo.cn/pub/category?cat=1899&page=";//xiaohua
var baseUrl2 = "http://weibo.cn/pub/category?cat=1099&page=";//yule
var baseUrl3 = "http://weibo.cn/pub/category?cat=1799&page=";//baoliao
var baseUrl4 = "http://weibo.cn/pub/category?cat=1999&page=";//qinggan
var baseUrl5 = "http://weibo.cn/pub/category?cat=6199&page=";//qiongrenqiongshi  

var baseArr = new Array(baseUrl1,baseUrl2,baseUrl3,baseUrl4,baseUrl5);
 
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
var crawl = function(flag,pageid,crawlcb){
  var baseUrlStr = baseArr[flag-1]+pageid;
  ep.assign('html',function(html){
    $ = cheerio.load(html);
    var weiboList = $('.c');
    var index = 1;  
    console.log(weiboList.length)
    async.whilst(
        function () { return index < weiboList.length; },
        function (callback){ 
          if(weiboList[index].children.length ===2 && typeof(weiboList[index].attribs.id) !== 'undefined' ){
              var weiboItem = weiboList[index].children[0];
              var weiboItemPic = weiboList[index].children[1];
              if(typeof(weiboItem.children[weiboItem.children.length-1].children)!=='undefined'){ 
                  var textStr = weiboItem.children[weiboItem.children.length-1].children[0].data.substring(1);; 
                  var imgStr = weiboItemPic.children[0].children[0].attribs.src.replace('wap180','large');   
                  var content = textStr+"<p><img src=\""+imgStr+"\"></p>";
                  var ep = new EventProxy(); 
                  var name = 'xitong';
                  var type = 1; 
                  ep.assign("userinfo","tid",function (userinfo,tid) {
                    uid=userinfo.uid; 
                    ArticleDao.getNumberByContent(imgStr.trim(),function(err,count){ 
                        console.log(count);
                        if(count === 0){
                             ArticleDao.saveNewArticleWithType(tid,content,uid,userinfo._id,type,flag,function(){ 
                                  index++;
                                   console.log('ccccccc') 
                                  setTimeout(callback, 10000); 
                             }); 
                        }else{
                            index++;
                            setTimeout(callback, 10000); 
                        }
                    })
                  })

                  UserDao.getUserInfoByName(name,function(err,userinfo){   
                    ep.emit("userinfo",userinfo);     
                  });

                  ArticleDao.getMaxTid(function(err,maxtid){   
                    ep.emit("tid",maxtid);
                  })
              }else{               
                  index++;
                  setTimeout(callback, 10000); 
              }   
        }else{ 
            index++;
            setTimeout(callback, 10000);
        }
        console.log(index)
        if(index === weiboList.length -1 ){
              crawlcb();          
        }
      },//callback
      function (err) {
              crawlcb();
             // 5 seconds have passed
      }
    );   
  });
  console.log("ccccc");
  get(baseUrlStr,function(err,data){
    var html;
    if(data != null){
      html = data.toString();
    }
    ep.emit('html',html);
  });
} 

 exports.index = function (req, res) { 
     	var flag = 5;
     	if(req.query.flag){
     		flag = req.query.flag;
     	} 
     	var page = 5;
    	async1.whilst(
    	    function () { return page > 0 ; },
    	    function (cb) {
    	      crawl(flag,page,function(){
    	            page--;
    	            setTimeout(cb,50000);         
    	      }); 
    	    },
    	    function(err){
    	    } 
    	); 
 }



