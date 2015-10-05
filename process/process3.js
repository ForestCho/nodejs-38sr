 var ArticleDao = require('../dao/articledao');
 var Article = require('../models/article');
 var mongoose = require('mongoose');
var marked = require('marked');
 var bosonnlp = require('bosonnlp');
 var util = require('../lib/util');
 var boson = new bosonnlp.BosonNLP("yoUTK8dE.3486.jTfMGWlrfZxc");
//mongoose.connect('mongodb://caosl:123456@107.170.206.235:27017/blogdb');
//mongoose.connect('mongodb://caosl:123456@127.0.0.1:27017/blogdb');
 /*
  * GET find password page.
  */
 Article.find({ 
     tid: 3762
 }).sort({
     'post_date': -1
 }).exec(function(err, articlelist) {
     articlelist.forEach(function(article) {  
                 article.mcontent = article.mcontent.replace(/(##{1,4})/g,"$1# ");
                 console.log(marked(article.mcontent));
                 article.content = marked(article.mcontent);
                 article.save();
     }); 
 })