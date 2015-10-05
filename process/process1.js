 var ArticleDao = require('../dao/articledao');
 var Article = require('../models/article');
 var mongoose = require('mongoose');
 var bosonnlp = require('bosonnlp');
 var util = require('../lib/util');
 var boson = new bosonnlp.BosonNLP("yoUTK8dE.3486.jTfMGWlrfZxc");
//mongoose.connect('mongodb://caosl:123456@107.170.206.235:27017/blogdb');
//mongoose.connect('mongodb://caosl:123456@127.0.0.1:27017/blogdb');
 /*
  * GET find password page.
  */
 Article.find({ 
     isdelete: false,
     classify: 2
 }).sort({
     'post_date': -1
 }).exec(function(err, articlelist) {
     articlelist.forEach(function(article) { 
             console.log(article.content);
                 var reg = /<p><br><\/p>/g;
                 var reg1 = /<p>　<\/p>/;
                 article.content = article.content.replace(reg,'');
                 article.content = article.content.replace(reg1,'');
                 article.save(); 
     }); 
 })