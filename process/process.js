 var ArticleDao = require('../dao/articledao');
 var Article = require('../models/article');
 var mongoose = require('mongoose');
 var bosonnlp = require('bosonnlp');
 var util = require('../lib/util');
 var boson = new bosonnlp.BosonNLP("yoUTK8dE.3486.jTfMGWlrfZxc");
 //mongoose.connect('mongodb://caosl:123456@107.170.206.235:27017/blogdb');
 /*
  * GET find password page.
  */
 Article.find({
     flag: 0,
     isdelete: false,
     classify: 2
 }).sort({
     'post_date': 1
 }).exec(function(err, articlelist) {
     articlelist.forEach(function(article) {
         if (typeof(article.label) == 'undefined') {
             console.log(article.content);
             boson.extractKeywords(util.delHtmlTag(article.content), function(data) {
                 data = JSON.parse(data);
                 //  console.log(labeljson);
                 var label = '';
                 var labeljson = data[0];
                 if (typeof(labeljson) !== 'undefined') {
                     for (var k = 0; k < (labeljson.length > 5 ? 5 : labeljson.length); k++) {
                         label += labeljson[k][1] + ','
                     };

                 }
                 article.label = label;
                 article.save();
             });
         }
     });
     /*     for (var i = 0; i < articlelist.length; i++) {
         (function(i) {
             if (typeof(article.label) == 'undefined') {
                 console.log(article.content);
                 boson.extractKeywords(util.delHtmlTag(article.content), function(data) {
                     data = JSON.parse(data);
                     var labeljson = data[0];
                     console.log(labeljson);
                     var label = '';
                     for (var k = 0; k < (labeljson.length > 5 ? 5 : labeljson.length); k++) {
                         label += labeljson[k][1] + ','
                     };
                     article.label = label;
                     article.save();
                 });
             }
         })(i);
     };*/
 })