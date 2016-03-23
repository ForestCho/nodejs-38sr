var UserDao = require('../../dao/userdao');
var ZymryjDao = require('../../dao/zymryjdao');
var util = require('../../lib/util');
var ArticleDao = require('../../dao/articledao');
var moment = require('moment');
var config = require('../../config').config;
var cache = require('../../common/cache');
var EventProxy = require('eventproxy');

/**
 * [commonQuery description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @param  {[type]} curpath
 * @param  {[type]} articleLimit
 * @param  {[type]} cataZh
 * @param  {[type]} classify
 * @return {[type]}
 */
var commonQuery = function(req, res,  articleLimit,  classify) {
    var p = 1; //pageid
    var pagesize = config.index.list_article_size;
    var puretext = true;
    var list_hot_user_size = config.index.list_hot_user_size;
    var count = 0;
    if (req.query.p) {
        p = req.query.p;
    }  
    var ep = new EventProxy();
      ep.assign("articlelist", 'count', function(articlelist,  count) {
        var d = {};
        d.data = articlelist; 
        d.count = count;
 		res.json(d);  
    });

    ArticleDao.getNumberOfArticlesAsObect(articleLimit, function(err, count) {
        ep.emit("count", count);
    });


    ArticleDao.getArticleListLimitAsObject(puretext, p, pagesize, articleLimit, function(err, articlelist) {
        for (var i = 0; i < articlelist.length; i++) {
            var b = /<img[^>]+src="[^"]+"[^>]*>/g;
            var imglist = articlelist[i].content.match(b)
            var newcontent = articlelist[i].purecontent;
            if (articlelist[i].classify == 1) {
                articlelist[i].title = encodeURIComponent(articlelist[i].title); 
            }
            var briefnum = 50;
            var contentlength = util.getSize(newcontent);
            if (imglist !== null) {
                if (imglist.length > 0) {
                    var srcReg = /http:\/\/([^"]+)/i; 
                    var srcStr = imglist[0].match(srcReg);  
                    articlelist[i].pic= srcStr[0];//+"!limitmax";   
                    if (articlelist[i].type == 1) {
                        var imgWrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0].replace('large', 'wap180') + "' class='thumb'></a>"
                    } else {
                        var imgWrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0] + "!limitmax" + "' class='thumb'></a>"
                    }
                    newcontent = imgWrap + newcontent.substring(0, (contentlength > briefnum) ? util.getIndex(newcontent, briefnum) : contentlength).trim();
                }
            } else {
                newcontent = newcontent.substring(0, (contentlength > briefnum * 2) ? util.getIndex(newcontent, briefnum * 2) : contentlength).trim();

            }
            if (contentlength > briefnum) {
                newcontent = newcontent + '...';
            }
            articlelist[i].imagelength = imglist !== null ? imglist.length : 0;
            articlelist[i].newcontent = newcontent;
        }
        ep.emit("articlelist", articlelist);
    })
 
  
}
 

/**
 * [index 广场路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.gc  = function(req, res) {
    var flag = 0; 
    var classify = 1; 
    res.locals.pageflag = -1;
    var articleLimit = {
        isdelete: false
    }; 
    commonQuery(req, res, articleLimit, classify);
}

/**
 * [mood 心情路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.mood  = function(req, res) {
    var classify = 0; 
    var articleLimit = {
        classify: classify,
        isdelete: false
    }; 
    commonQuery(req, res, articleLimit, classify);
}

/**
 * [article article路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.article  = function(req, res) {
    var flag = 0;
    var classify = 2; 
    var articleLimit = {
        classify: classify,
        isdelete: false
    }; 
    commonQuery(req, res, articleLimit, classify);
}

/**
 * [fastlink 快链路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.fastlink  = function(req, res) {
    var classify = 1;  
    var articleLimit = {
        classify: classify,
        isdelete: false
    }; 
    commonQuery(req, res, articleLimit,  classify);
}
 