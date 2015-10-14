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
 * GET home page.
 */

//mongoose.connect('mongodb://caosl:123456@127.0.0.1:27017/blogdb');
//mongoose.connect('mongodb://127.0.0.1:27017/blogdb');
 mongoose.connect('mongodb://caosl:123456@107.170.206.235:27017/blogdb'); 

var commonQuery = function(req, res, curpath, articleLimit, cataZh, classify) {
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
    ep.assign("articlelist", "hotuser", 'zymryj','count', function(articlelist, hotuser, zymryj,count) {
        var d = []; 
        d.data = articlelist;
        d.hotuser = hotuser; 
        d.count = count;
        res.render(classify == 2 ? 'indexarticle' : 'index', {
            title: '做一名简单的锶者!',
            curpath: curpath,
            d: d,
            p: p, 
            zymryj: zymryj,
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
            var briefnum = (classify == 2) ? 80 : 180;
            var contentlength = util.getSize(newcontent);
            if (imglist !== null) {
                if (imglist.length > 0) {
                    var srcReg = /http:\/\/([^"]+)/i;
                    var srcStr = imglist[0].match(srcReg);
                    if (articlelist[i].type == 1) {
                        var imgWrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0].replace('large', 'wap180') + "' class='thumb'></a>"
                    } else {
                        var imgWrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0] + "!limitmax" + "' class='thumb'></a>"
                    }
                newcontent = imgWrap + newcontent.substring(0, (contentlength > briefnum) ? util.getIndex(newcontent,briefnum) : contentlength).trim();
                }
            } else {
                newcontent = newcontent.substring(0, (contentlength > briefnum*2) ? util.getIndex(newcontent,briefnum*2) : contentlength).trim();

            }
            if (contentlength > briefnum) {
                newcontent = newcontent + '...';
            }
            articlelist[i].newcontent = newcontent;
        } 
        ep.emit("articlelist", articlelist);
    })

    cache.get('hotuser', ep.done(function(hotuser) { 
        if (hotuser) { 
            ep.emit('hotuser', hotuser);
        } else { 
            UserDao.getUserListByScore(list_hot_user_size,
                ep.done('hotuser', function(hotuser) {
                    cache.set('hotuser', hotuser, 4 * 60 * 1);
                    return hotuser;
                })
            );
        }
    }));

    cache.get('zymryj', ep.done(function(zymryj) {
        if (zymryj) {
            ep.emit('zymryj', zymryj);
        } else {
            ZymryjDao.getZymryjOfCurrday(
                ep.done('zymryj', function(zymryj) {
                    cache.set('zymryj', zymryj, 24 * 60 * 1);
                    return zymryj;
                })
            );
        }
    }));
/*    UserDao.getNumberOfAllUser(function(err, usercount) {
        ep.emit("usercount", usercount);
    });*/
}

//首页路由
exports.index = function(req, res) {
    var flag = 0;
    var cataZh = "个记录";
    var classify = 1;
    var curpath = "/";
    res.locals.pageflag = -1;
    var articleLimit = {
        '$or': [{
            flag: flag
        }, {
            classify: classify
        }],
        isdelete: false
    };
    commonQuery(req, res, curpath, articleLimit, cataZh, classify);
}

//心情路由
exports.mood = function(req, res) {
    var flag = 0;
    var classify = 0;
    var cataZh = "条心情";
    var curpath = "/mood";
    res.locals.pageflag = 0;
    var articleLimit = {
        classify: classify,
        flag: flag,
        isdelete: false
    };
    commonQuery(req, res, curpath, articleLimit, cataZh, classify);
}
//article路由
exports.article = function(req, res) {
    var flag = 0;
    var classify = 2;
    var cataZh = "篇文章";
    var curpath = "/article";
    res.locals.pageflag = 2;
    var articleLimit = {
        classify: classify,
        flag: flag,
        isdelete: false
    };
    commonQuery(req, res, curpath, articleLimit, cataZh, classify);
}
//快链路由
exports.fastlink = function(req, res) {
    var classify = 1;
    var cataZh = "条快链";
    var curpath = "/fastlink";
    res.locals.pageflag = 1;
    var articleLimit = {
        classify: classify,
        isdelete: false
    };
    commonQuery(req, res, curpath, articleLimit, cataZh, classify);
}

//笑话路由
exports.xiaohua = function(req, res) {
    var curpath = "/xiaohua";
    var cataZh = "句笑话";
    var curpath = "/xiaohua";
    res.locals.pageflag = 4;
    var articleLimit = {
        flag: {
            '$gt': 1
        },
        isdelete: false
    };
    commonQuery(req, res, curpath, articleLimit, cataZh, 2);
}