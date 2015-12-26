var util = require('../../lib/util');
var UserDao = require('../../dao/userdao');
var EventProxy = require('eventproxy');
var sanitize = require('validator');
var config = require('../../config').config;
/*
 * GET login page and do login
 */

exports.login = function(req, res) { 
    var msg = {}; 
    msg.status = -1;
    res.render('admin/login', {
        title: '登录', 
        msg: msg
    });
};

exports.dologin = function(req, res) {
    var name = sanitize.trim(req.body.uname);
    var pwd = sanitize.trim(req.body.pwd); 
    var remember = req.body.remember;
    var id = 1;
    var md5pwd = util.md5_str(pwd);
    var msg = {};
    var ep = new EventProxy();
    if (name.length === 0) {
        msg.content = "账户不能为空，ｏ（╯□╰）ｏ!!";
        msg.status = 0;
        res.render('admin/login', {
            title: '登录', 
            msg: msg
        });
        return;
    }
    if (pwd.length === 0) {
        msg.content = "密码不能为空，ｏ（╯□╰）ｏ!!";
        msg.status = 0;
        res.render('admin/login', {
            title: '登录', 
            msg: msg
        });
        return;
    }

    ep.assign("userinfo", function(userinfo) {
        if (remember) {
            var auth_token = util.encrypt(userinfo.uid + '|' + userinfo.uname, config.session_secret)
            res.cookie(config.cookie_name, auth_token, {
                path: config.cookie_path,
                maxAge: 1000 * 60 * 60 * 24 * 7
            });
        }
        req.session.user = userinfo;
        res.locals.userinfo = req.session.user;
        res.redirect("/admin/index");
    });

    UserDao.getAdminUserInfoByName(name, function(err, tempuser) {
        if (err) {
            res.redirect('common/500');
            return;
        }
        if (!tempuser) {
            msg.content = "账号不存在!!";
            msg.status = 0;
            res.render('admin/login', {
                title: '登录', 
                msg: msg
            });
            return;
        }
        if (md5pwd != tempuser.pwd) {
            msg.content = "密码不正确!!";
            msg.status = 0;
            res.render('admin/login', {
                title: '登录', 
                msg: msg
            });
            return;
        }
        ep.emit("userinfo", tempuser);
    })
};

exports.user_auth = function(req, res, next) {
    if (req.session.user) {
        var uid = req.session.user.uid;
        res.locals.userinfo = req.session.user;
        next();
        return;
    } else {
        var cookie = req.cookies[config.cookie_name];
        if (!cookie) {
            next();
            return;
        }
        var auth_token = util.decrypt(cookie, config.session_secret);
        var auth = auth_token.split('|');
        var uid = auth[0];
        UserDao.getUserInfoByUid(uid, function(err, curruser) {
            if (err) {
                return next(err);
            }
            req.session.user = curruser;
            res.locals.userinfo = curruser;
            next();
            return;
        });
    }
}