var UserDao = require('../dao/userdao');
var ZymryjDao = require('../dao/zymryjdao');
var util = require('../lib/util');
var ArticleDao = require('../dao/articledao');
var moment = require('moment');
var config = require('../config').config;
var cache = require('../common/cache');
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
var commonQuery = function(req, res, curpath, articleLimit, cataZh, classify) {
    var p = 1; //pageid
    var pagesize = config.index.list_article_size;
    var flag = -1;
    var tpl = "index"; 
    if (typeof(articleLimit.classify)) {
        if (articleLimit.classify == 2) {
            tpl = "indexarticle";
        } else if (articleLimit.classify == 1) {
            tpl = "indexlink";
            pagesize = config.index.list_link_size;
        } else {
            tpl = "index";
        }
    }
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

    var DIS_TAGS = req.cookies["DIS_TAGS"];
    var tags = [];
    if (DIS_TAGS !== '1') {
        tags = ['PHP', '正则', '前端', 'JavaScript', '测试', 'java', 'linux', '面试', 'mysql', '试题', '数据库', '编程', '源码', '爬虫', 'html', '工具', 'less', 'sublime', '插件'];
    }
    ep.assign("articlelist", "hotuser", 'zymryj', 'count', function(articlelist, hotuser, zymryj, count) {
        var d = [];
        d.data = articlelist;
        d.hotuser = hotuser;
        d.count = count;
        d.tags = tags;

        res.render(tpl, {
            title: '做一体化的IT社区!',
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
            var briefnum = 120;
            var contentlength = util.getSize(newcontent);
            var imgwrap = '';
            if (imglist !== null) {
                if (imglist.length > 0) {
                    var srcReg = /http:\/\/([^"]+)/i;
                    var srcStr = imglist[0].match(srcReg);
                    if (articlelist[i].type == 1) {
                        imgwrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0].replace('large', 'wap180') + "' class='thumb'></a>"
                    } else {
                        if (srcStr[0].indexOf("srpic.b0.upaiyun.com") > 0) {
                            imgwrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0] + "!limitmax" + "' class='thumb'></a>"
                        } else {
                            imgwrap = "<a rel='fancypic' href='" + srcStr[0] + "'><img src='" + srcStr[0] + "' class='thumb opimg'></a>"
                        }
                    }
                    newcontent = imgwrap + "<div class='textcontent'>" + newcontent.substring(0, (contentlength > briefnum) ? util.getIndex(newcontent, briefnum) : contentlength).trim() + "</div>";
                }
            } else {
                newcontent = newcontent.substring(0, (contentlength > briefnum * 2) ? util.getIndex(newcontent, briefnum * 2) : contentlength).trim();
            }
            if (contentlength > briefnum) {
                newcontent = newcontent + '...';
            }
            if (articlelist[i].classify == 1) {
                articlelist[i].title = encodeURIComponent(articlelist[i].title);
            }
            if (articlelist[i].classify == 0) {
                articlelist[i].title = util.getFirstSentence(articlelist[i].purecontent);
            }
            articlelist[i].imagelength = imglist !== null ? imglist.length : 0;
            articlelist[i].newcontent = newcontent;
            articlelist[i].imgwrap = imgwrap;
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
}

/**
 * [index 首页路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.index = function(req, res) {
    var cookie = req.cookies["SR_TAB"];
    switch (cookie) {
        case '-1':
            gc(req, res);
            break;
        case "0":
            mood(req, res);
            break;
        case "1":
            fastlink(req, res);
            break;
        case "2":
            article(req, res);
            break;
        default:
            gc(req, res);
            break;
    }
}

/**
 * [index 广场路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.gc = gc = function(req, res) {
    var flag = 0;
    var cataZh = "个记录";
    var classify = 1;
    var curpath = "/";
    res.locals.pageflag = -1;
    var articleLimit = {
        isdelete: false
    };
    res.cookie("SR_TAB", '-1', {
        path: config.cookie_path,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    commonQuery(req, res, curpath, articleLimit, cataZh, classify);
}

/**
 * [mood 心情路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.mood = mood = function(req, res) {
    var classify = 0;
    var cataZh = "条心情";
    var curpath = "/mood";
    res.locals.pageflag = 0;
    var articleLimit = {
        classify: classify,
        isdelete: false
    };
    res.cookie("SR_TAB", '0', {
        path: config.cookie_path,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    commonQuery(req, res, curpath, articleLimit, cataZh, classify);
}

/**
 * [article article路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.article = article = function(req, res) {
    var flag = 0;
    var classify = 2;
    var cataZh = "篇文章";
    var curpath = "/article";
    res.locals.pageflag = 2;
    var articleLimit = {
        classify: classify,
        isdelete: false
    };
    res.cookie("SR_TAB", '2', {
        path: config.cookie_path,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    commonQuery(req, res, curpath, articleLimit, cataZh, classify);
}

/**
 * [fastlink 快链路由]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.fastlink = fastlink = function(req, res) {
    var classify = 1;
    var cataZh = "条快链";
    var curpath = "/fastlink";
    res.locals.pageflag = 1;
    var articleLimit = {
        classify: classify,
        isdelete: false
    };
    res.cookie("SR_TAB", '1', {
        path: config.cookie_path,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    commonQuery(req, res, curpath, articleLimit, cataZh, classify);
}

exports.fljson = fljson = function(req,res){
    var classify = 1; 
    var articleLimit = {
        classify: classify,
        isdelete: false
    };
    var pageid = 1;
    var pagesize = config.index.list_link_size;  
    var count = 0;
    if (req.query.pageid) {
        pageid = req.query.pageid;
    } 
    var ep = new EventProxy();
 
    ep.assign("articlelist", 'count', function(articlelist, count) {
        var d = {}; 
        var resHtml = '';
        for(var i = 0;i<articlelist.length;i++){
            resHtml += '<div class="linkitem">'+
                     '<div class="left-box">'+
                         '<div class="photowrap"><a class="userlink show-pop-async" data-uid='+articlelist[i]._creator.uid+' href="/user/'+ articlelist[i]._creator.name +'"><img src='+ articlelist[i]._creator.photo +'></a></div>'+
                         '<div class="linktitle"><a href="/redirect?url='+articlelist[i].title +'" target="_blank" class="urltype">'+ articlelist[i].content +'</a></div>'+
                     '</div>'+
                     '<div class="right-box">  '+                      
                         '<div class="linkdate">'+
                             '<i class="fa fa-clock-o"></i>'+ articlelist[i].convertdate  +
                         '</div>';
            if(articlelist[i]._sid){
                resHtml+='<a  class="linkicon" href="/site/'+ articlelist[i]._sid._id +'/"  data-toggle="tooltip" data-placement="right" title="'+articlelist[i]._sid.sbrief +'">'+articlelist[i]._sid.sname +'</a>';
            }else{
                resHtml+='net';
            }               
             resHtml+='</div><div class="clearfix"></div></div>';
        }
        d.list = resHtml;
        d.listcount = articlelist.length; 
        d.pagesize = pagesize;
        res.json(d); 
    });

    ArticleDao.getNumberOfArticlesAsObect(articleLimit, function(err, count) {
        ep.emit("count", count);
    });


    ArticleDao.getArticleListLimitAsObject(true, pageid, pagesize, articleLimit, function(err, articlelist) { 
        ep.emit("articlelist", articlelist);
    })
  
 
}
/**
 * [xiaohua 笑话路由 ]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
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