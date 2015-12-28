var UserDao = require('../dao/userdao');
var ZymryjDao = require('../dao/zymryjdao');
var util = require('../lib/util');
var ArticleDao = require('../dao/articledao');
var moment = require('moment');
var config = require('../config').config;
var cache = require('../common/cache');
var EventProxy = require('eventproxy');
var mongoose = require('mongoose');
/*
 * 公共查询函数
 */
var commonQuery = function(req, res, curpath, articleLimit, cataZh, tagname) {
    var p = 1;//pageid
    var pagesize = config.index.list_article_size;
    var puretext = true;
    var list_hot_user_size = config.index.list_hot_user_size;
    var count = 0;
    if (req.query.p) {
        p = req.query.p;
    }
    if (req.session.user) {
        res.locals.userinfo = req.session.user;
    }
    var ep = new EventProxy();
    ep.assign("count", "articlelist", function(count, articlelist) {
        var d = [];
        d.count = count;
        d.tagname = tagname;
        d.data = articlelist;
        res.render('tag', {
            title: '做一名简单的锶者!',
            curpath: curpath,
            d: d,
            p: p,
            cataZh: cataZh
        });
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
            if (imglist !== null) {
                if (imglist.length > 0) {
                    var srcReg = /http:\/\/([^"]+)/i;
                    var srcStr = imglist[0].match(srcReg);
                    if (articlelist[i].type == 1) {
                        var imgWrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0].replace('large', 'wap180') + "' class='thumb'></a>"
                    } else {
                        var imgWrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0] + "!limitmax" + "' class='thumb'></a>"
                    }
                    newcontent = imgWrap + newcontent.substring(0, (newcontent.length > 150) ? 150 : newcontent.length).trim();
                }
            } else {
                newcontent = newcontent.substring(0, (newcontent.length > 180) ? 180 : newcontent.length).trim();
            }
            articlelist[i].newcontent = newcontent;
        }

        ep.emit("articlelist", articlelist);
    })

}

/*
 * 标签页面
 */
exports.index = function(req, res) {
    var tagname = req.params.tagname;
    var flag = 0;
    var classify = 2;
    var cataZh = "篇文章";
    var curpath = "/article";
    res.locals.pageflag = 5;
    console.log(tagname);
    var articleLimit = {
        classify: classify, 
        isdelete: false,
        label: new RegExp(tagname + ',')
    };
    commonQuery(req, res, curpath, articleLimit, cataZh, tagname);
}