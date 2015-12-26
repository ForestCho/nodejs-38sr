var ArticleDao = require('../../dao/articledao'); 
var UserDao = require('../../dao/userdao');
var Article = require('../../models/article');
var mongoose = require('mongoose');
var EventProxy = require('eventproxy');
var path = require('path');
var config = require('../../config').config;
var UPYun = require('../../lib/upyun').UPYun;
var marked = require('marked');
var util = require('../../lib/util');
/*
 * GET publish a new site
 */
exports.list = function(req, res) {
    var p = 1;//pageid
    var classify = 1;
    var curpath  = "/admin/list";
    var flag = 0;
    var pagesize = config.index.list_admin_article_size;
    var count = 0;
    if (req.query.p) {
        p = req.query.p;
    }
    var articleLimit = {
        '$or': [{
            flag: flag
        }, {
            classify: classify
        }],
        isdelete: false
    };

    var ep = new EventProxy();
    ep.assign("articlelist",'count', function(articlelist, hotuser, zymryj,count) {
        var d = []; 
        d.data = articlelist; 
        d.count = count;
        res.render('admin/articlelist', {
            title: '文章管理',
            curpath: curpath,
            d: d,
            p: p
        });  
    });

    ArticleDao.getNumberOfArticlesAsObect(articleLimit, function(err, count) {
        ep.emit("count", count);
    });

     ArticleDao.getArticleListLimitAsObject(true, p, pagesize, articleLimit, function(err, articlelist) {
        for (var i = 0; i < articlelist.length; i++) {
            var b = /<img[^>]+src="[^"]+"[^>]*>/g;
            var imglist = articlelist[i].content.match(b)
            var newcontent = articlelist[i].purecontent;
            if (articlelist[i].classify == 1) {
                articlelist[i].title = encodeURIComponent(articlelist[i].title);
            }
            var briefnum = 18;
            var contentlength = util.getSize(newcontent); 
            newcontent = newcontent.substring(0, (contentlength > briefnum*2) ? util.getIndex(newcontent,briefnum*2) : contentlength).trim();
 
            articlelist[i].imagelength = imglist !== null?imglist.length:0;
            articlelist[i].newcontent = newcontent;
        } 
        ep.emit("articlelist", articlelist);
    }) 
};

exports.addarticle = function(req, res) { 
        res.render('admin/addarticle', {
            title: '增加文章', 
        }); 
};

exports.getarticle = function(req, res) {
    var tid = req.params.tid; 
        ArticleDao.getArticleByTid(tid, function(err, article) {
            res.render('admin/updatearticle', {
                title: article.title,
                article: article, 
            });
        }); 
};

exports.save = function(req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var smallimg = req.body.smallimg;
    var flag = req.body.flag;
    var classify = 0;
    var name = req.session.user.name;
    var uid = 0;
    var tid = 0;
    var ep = new EventProxy();
    ep.assign("userinfo", "tid", function(userinfo, tid) {
        uid = userinfo.uid;
        var articleItem = new Article({
            tid: tid,
            title: title,
            smallimg: smallimg,
            content: content,
            uid: uid,
            _creator: userinfo._id,
            flag: flag,
            classify: classify,
            isdelete: false
        });
        ArticleDao.saveNewArticleAsObject(articleItem, function() {
            var condition = {
                uid: uid
            };
            var update = {
                $inc: {
                    score: 1
                }
            };
            var options = false;
            UserDao.updateUserInfoFree(condition, update, options, function(err, num) {
                if (err) {
                    res.redirect('/500')
                    return;
                };
                res.redirect('/admin/list');
            });
        });
    })
    UserDao.getUserInfoByName(name, function(err, userinfo) {
        ep.emit("userinfo", userinfo);
    });
    ArticleDao.getMaxTid(function(err, maxtid) {
        ep.emit("tid", maxtid);
    })
};
exports.updatearticle = function(req, res) {
    var tid = req.body.tid;
    var title = req.body.title;
    var content = req.body.content;
    var smallimg = req.body.smallimg;
    var flag = req.body.flag;
    var condition = {
        tid: tid
    };
    var update = {
        $set: {
            title: title,
            smallimg: smallimg,
            content: content,
            smallimg: smallimg,
            flag: flag
        }
    };
    var options = false;
    ArticleDao.updateArticleInfo(condition, update, options, function(err, num) {
        if (err) {
            res.redirect('/500')
            return;
        };
        console.log(num);
        res.redirect('/admin/list');
    });
};

exports.delete = function(req, res) {
    var tid = req.query.tid;
    if (tid < 0) {
        res.json({
            status: 0
        });
        return;
    }
    ArticleDao.deleteArticleByTid(tid, function(err) {
        if (err) {
            res.json({
                status: -1
            });
            return;
        }
        res.json({
            status: 1
        });
    });
}