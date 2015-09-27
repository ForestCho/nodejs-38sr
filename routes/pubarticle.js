var UserDao = require('../dao/userdao');
var ArticleDao = require('../dao/articledao');
var Article = require('../models/article');
var path = require('path');
var util = require('../lib/util');
var mongoose = require('mongoose');
var EventProxy = require('eventproxy');
var bosonnlp = require('bosonnlp');
var marked = require('marked');
var boson = new bosonnlp.BosonNLP("yoUTK8dE.3486.jTfMGWlrfZxc");
//mongoose.connect('mongodb://localhost/blogdb');

/*
 * GET publish article page.
 */

exports.save = function(req, res) {
    var title = req.body.title;
    var mcontent = req.body.mcontent;
    var label = req.body.label;
    var cateid = req.body.cateid;
    var classify = 0;
    var name = req.session.user.name;
    var uid = 0;
    var tid = 0;
    var label = '';
    var ep = new EventProxy();
    var content = marked(mcontent);
    ep.assign("userinfo", "tid","label", function(userinfo, tid,label) {
        uid = userinfo.uid;

        var articleItem = new Article({
            tid: tid,
            title: title,
            content: content,
            mcontent:mcontent,
            uid: uid,
            _creator: userinfo._id,
            flag: cateid,
            classify: classify,
            label:label,
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
                res.redirect('/');
            });
        });
    })

    if (title.length > 0) {
    	classify = 2;
        boson.extractKeywords(util.delHtmlTag(content), function(data) {
            data = JSON.parse(data);
                console.log(data);
            var labeljson = data[0];
                console.log(labeljson);
            for (var i = 0; i < (labeljson.length > 5 ? 5 : labeljson.length); i++) {
                label +=labeljson[i][1] + ',' 
                console.log(label);
            };
   		    ep.emit("label", label);
        });
    } else {
        ep.emit("label", label);
    }
    UserDao.getUserInfoByName(name, function(err, userinfo) {
        ep.emit("userinfo", userinfo);
    });

    ArticleDao.getMaxTid(function(err, maxtid) {
        ep.emit("tid", maxtid);
    })

};

exports.index = function(req, res) {
    if (!req.session.user) {
        var prelink = "pub";
        res.locals.error = "请先登录!!";
        res.render('login', {
            title: '登录',
            prelink: prelink
        });
    } else {
        res.locals.pageflag = 3;
        res.locals.userinfo = req.session.user;
        res.render('pubarticle', {
            title: '分享一个'
        });
    }
};