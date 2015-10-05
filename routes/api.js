// GET
var UserDao = require('../dao/userdao');  
var ZymryjDao = require('../dao/zymryjdao');   
var util = require('../lib/util');   
var ArticleDao = require('../dao/articledao');   
var moment = require('moment'); 
var config = require('../config').config;
var cache = require('../common/cache');
var EventProxy = require('eventproxy');
var mongoose = require('mongoose'); 

exports.posts = function (req, res) { 
  var pageid = req.query.pageid;
  var pagesize = config.index.list_article_size;
  var puretext = true;
  var flag = 0; 
  var classify = 1; 
  var articleLimit = {'$or':[{flag:flag},{classify:classify}],isdelete:false}; 

  var ep = new EventProxy();  
 
  ep.assign("total","articlelist",function (total,articlelist) {
    var d= {}; 
      d.total = total;
      d.data = articlelist;    
      d.pageSize = pagesize;
      d.pageIndex = parseInt(pageid); 
      res.json(d); 
  });

  ArticleDao.getNumberOfArticlesAsObect(articleLimit,function (err,total) {
    ep.emit("total",total);
  });

  ArticleDao.getArticleListLimitAsObject(puretext,pageid,pagesize,articleLimit,function(err,articlelist){  
    for(var i =0;i<articlelist.length;i++){
      var b = /<img[^>]+src="[^"]+"[^>]*>/g ;
      var imglist = articlelist[i].content.match(b)  
      var newcontent = articlelist[i].purecontent;
      if(articlelist[i].classify != 0){
        articlelist[i].title = encodeURIComponent(articlelist[i].title);
      }  
      if(imglist !== null){
        if(imglist.length>0){
          var srcReg = /http:\/\/([^"]+)/i; 
          var srcStr = imglist[0].match(srcReg);  
          if(articlelist[i].type == 1){ 
            var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0].replace('large','wap180')+"' class='thumb'></a>"
          }else{
            var imgWrap = "<a rel='fancypic' href='"+srcStr[0]+"'><img src='"+srcStr[0]+"!limitmax"+"' class='thumb'></a>"
          }  
          newcontent= imgWrap+newcontent.substring(0,(newcontent.length > 150)?150:newcontent.length).trim();
        }
      }else{        
        newcontent= newcontent.substring(0,(newcontent.length > 180)?180:newcontent.length).trim();
      } 
      articlelist[i].newcontent = newcontent;  
    } 
    ep.emit("articlelist",articlelist);
  })  
};
 
 exports.partials = function (req, res) {
  var name = req.params.name;
  console.log(name);
  res.render('_partials/' + name);
};