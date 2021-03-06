var UserDao = require('../dao/userdao');
var ZymryjDao = require('../dao/zymryjdao');
var SiteDao = require('../dao/sitedao');
var util = require('../lib/util');
var ArticleDao = require('../dao/articledao');
var moment = require('moment');
var config = require('../config').config;
var cache = require('../common/cache');
var EventProxy = require('eventproxy');
var mongoose = require('mongoose');

/**
 * [commonQuery 公共查询函数]
 * @param  {[type]} req
 * @param  {[type]} res
 * @param  {[type]} curpath
 * @param  {[type]} articleLimit
 * @param  {[type]} cataZh
 * @param  {[type]} site_id
 * @return {[type]}
 */
var commonQuery = function(req, res, curpath, articleLimit, cataZh, site_id) {
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
    ep.assign("count", "articlelist","sitename", function(count, articlelist,sitename) {
        var d = [];
        d.count = count;
        d.sitename = sitename;
        d.data = articlelist; 
        res.render('site', {
            title: '做一名简单的锶者!',
            curpath: curpath,
            d: d,
            p: p,
            cataZh: cataZh
        });
    });

SiteDao.getSiteByObj({_id:site_id},function(err,date){
    ep.emit("sitename",date.sname);

})
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
                         if(srcStr[0].indexOf("srpic.b0.upaiyun.com")>0){
                                imgWrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0] + "!limitmax" + "' class='thumb'></a>"
                            }else{
                                imgWrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0]  + "' class='thumb opimg'></a>"
                            }
                   }
                    newcontent = imgWrap + "<div class='textcontent'>"+newcontent.substring(0, (newcontent.length > 150) ? 150 : newcontent.length).trim()+"</div>";
                }
            } else {
                newcontent = newcontent.substring(0, (newcontent.length > 180) ? 180 : newcontent.length).trim();
            }
            articlelist[i].newcontent = newcontent;
            console.log(articlelist.length);
        }

        ep.emit("articlelist", articlelist);
    })

}

/*
 * 标签页面
 */
exports.index = function(req, res) {
    var site_id = req.params.site_id;
    var classify = 1; 
    var cataZh = "条记录";
    var curpath = "/article";
    res.locals.pageflag = 5;  
    console.log(site_id);
    var articleLimit = { 
        classify: classify,
        isdelete: false,
        _sid: site_id
    };
    commonQuery(req, res, curpath, articleLimit, cataZh, site_id);
}