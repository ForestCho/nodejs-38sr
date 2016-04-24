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
var bosonnlp = require('bosonnlp');
var marked = require('marked');
var boson = new bosonnlp.BosonNLP("yoUTK8dE.3486.jTfMGWlrfZxc");


/**
 * [list description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.list = function(req, res) {
    var p = 1; //pageid
    var classify = 1;
    var curpath = "/admin/list";
    var flag = 0;
    var pagesize = config.index.list_admin_article_size;
    var count = 0;
    if (req.query.p) {
        p = req.query.p;
    }
    var articleLimit = {
        isdelete: false
    };

    var ep = new EventProxy();
    ep.assign("articlelist", 'count', function(articlelist, count) {
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
            if (articlelist[i].classify == 1) {
                articlelist[i].title = encodeURIComponent(articlelist[i].title);
            }
            if (articlelist[i].classify == 0) { 
                articlelist[i].title = util.getFirstSentence(articlelist[i].purecontent);
            }
            var titlelength = articlelist[i].title.length;
            articlelist[i].title = articlelist[i].title.substring(0,(titlelength>24)?24:titlelength); 
        }
        ep.emit("articlelist", articlelist);
    })
};

/**
 * [addarticle description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.addarticle = function(req, res) {
    res.render('admin/addarticle', {
        title: '增加文章',
    });
};

/**
 * [getarticle description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.getarticle = function(req, res) {
    var tid = req.params.tid;
    ArticleDao.getArticleByTid(tid, function(err, article) {
        res.render('admin/updatearticle', {
            title: article.title,
            article: article,
        });
    });
};

/**
 * [save description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.save = function(req, res) {
    var title = req.body.title;
    var mcontent = req.body.mcontent;
    var label = req.body.label;
    var classify = 0;
    var name = req.session.user.name;
    var uid = 0;
    var tid = 0;
    var ep = new EventProxy();
    var content = marked(mcontent);
    ep.assign("userinfo", "tid", "label", function(userinfo, tid, label) {
        uid = userinfo.uid;
        var articleItem = new Article({
            tid: tid,
            title: title,
            content: content,
            mcontent: mcontent,
            uid: uid,
            _creator: userinfo._id,
            classify: classify,
            label: label,
            isdelete: false
        });
        console.log(articleItem);
        ArticleDao.saveNewArticleAsObject(articleItem, function() {
            var condition = {
                uid: uid
            };
            var update = {
                $inc: {
                    score: 1
                }
            };
            console.log(articleItem);
            var options = false;
            UserDao.updateUserInfoFree(condition, update, options, function(err, num) {
                if (err) {
                    res.redirect('/500')
                    return;
                };
                res.redirect('admin/index');
            });
        });
    })

    if (title.length > 0) {
        classify = 2;
        if (label.length == 0 || label == '') {
            boson.extractKeywords(util.delHtmlTag(content), function(data) {
                data = JSON.parse(data);
                var labeljson = data[0];
                console.log(labeljson);
                if (typeof(labeljson) !== 'undefined') {
                    for (var i = 0; i < (labeljson.length > 5 ? 5 : labeljson.length); i++) {
                        label += labeljson[i][1] + ','
                    };
                }
                ep.emit("label", label);
            });
        } else {
            ep.emit("label", label);
        }
    } else {
        if (label.length == 0 || label == '') {
            ep.emit("label", label);
        } else {
            ep.emit("label", label);
        }
    }
    UserDao.getUserInfoByName(name, function(err, userinfo) {
        ep.emit("userinfo", userinfo);
    });
    ArticleDao.getMaxTid(function(err, maxtid) {
        ep.emit("tid", maxtid);
    })
};

/**
 * [updatearticle description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.updatearticle = function(req, res) {
    var tid = req.body.tid;
    var title = req.body.title;
    var mcontent = req.body.mcontent;
    var label = req.body.label;
    var marked = require('marked');

    var ep = new EventProxy();
    var content = marked(mcontent);
    var condition = {
        tid: tid
    };
    var update = {
        $set: {
            title: title,
            label: label,
            mcontent: mcontent,
            content: content
        }
    };
    var options = false;
    ArticleDao.updateArticleInfo(condition, update, options, function(err, num) {
        if (err) {
            console.log(err)
            res.redirect('/500')
            return;
        };
        res.redirect('/admin/getarticle/' + tid);
    });
};

/**
 * [delete description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
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