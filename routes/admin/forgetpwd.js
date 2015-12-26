var UserDao = require('../../dao/userdao');
var nodemailer = require('nodemailer');
var util = require('../../lib/util');
var EventProxy = require('eventproxy');
var Repwd = require('../../models/repwd');
var sanitize = require('validator');
/*
 * GET find password page.
 */

exports.get = function(req, res) {
    res.render('admin/getpwdmail', {
        title: '找回密码'
    });
};

exports.resetpwd = function(req, res) {
    var email = req.query.email;
    var token = req.query.token;
    var msg = {};
    Repwd.findOne({_id: token}, function(err, temprepwd) {
        if (err) { 
            res.redirect('500');
        }
        if (!temprepwd) {
            msg.content = "这个链接有问题诶!!";
            msg.status = 0;
            res.render('admin/resetpwd', {
                title: '密码重置',
                msg: msg
            });
            return;
        }

        var now = new Date();
        if (now.getTime() > temprepwd.outdate.getTime()) {
            msg.content = "链接已经失效!!";
            msg.status = 0;
            res.render('admin/resetpwd', {
                title: '密码重置',
                msg: msg
            });
            return;
        }

        if (temprepwd.isvalid == 1) {
            msg.content = "链接已经用过一次了!!";
            msg.status = 0;
            res.render('resetpwd', {
                title: '密码重置',
                msg: msg
            });
            return;
        }
        res.render('resetpwd', {
            title: '重置密码',
            email: email,
            token: token
        });
    });
}
exports.sendmail = function(req, res) {
    var usermail = req.body.email;
    var randomPwd = util.random_string(12);
    var msg = {}
    var ep = new EventProxy();

    ep.assign("repwd", function(repwd) {
        var emailTitle = "【38锶网】重置密码";
        var getPwdLink = "http://38sr.com/resetpwd/?token=" + repwd._id + "&email=" + usermail;
        var str1 = "<a target='_blank' href='" + getPwdLink + "' _act='check_domail'>点击这里重置你的密码</a><br>";
        var str2 = "如果你的邮箱不允许链接，可以复制下边儿的连接在新窗口打开<br>";
        var str3 = getPwdLink;
        var htmlContent = str1 + str2 + str3;
        util.send_mail(usermail, emailTitle, htmlContent, function(error, response) {
            msg.content = "重置密码的邮件已发送!!";
            msg.status = 1;
            res.render('admin/resetpwd', {
                title: '找回密码',
                msg: msg
            });
        });
    });

    UserDao.getUserInfoByEmail(usermail, function(error, tempuser) {
        if (tempuser) {
            var now = new Date();
            var outdate = new Date(now.getTime() + 4 * 60 * 60 * 1000);
            console.log(now);
            console.log(outdate);
            var repwd = new Repwd({
                uid: tempuser.uid,
                outdate: outdate,
                isvalid: -1

            });
            repwd.save(function() {
                ep.emit("admin/repwd", repwd);
            });
        } else {
            msg.content = "请输入注册时的邮箱!!";
            msg.status = 0;
            res.render('getpwdmail', {
                title: '找回密码',
                msg: msg
            });
        }
    });
};

exports.doreset = function(req, res) {
    var email = sanitize.trim(req.body.email);
    var pwd = sanitize.trim(req.body.pwd);
    var token = req.body.token;
    var msg = {};
    var ep = new EventProxy();


    Repwd.findOne({
        _id: token
    }, function(err, temprepwd) {
        if (err) { 
            res.redirect('500');
        }
        if (!temprepwd) {
            msg.content = "这个链接有问题诶!!";
            msg.status = 0;
            res.render('resetpwd', {
                title: '密码重置',
                msg: msg
            });
            return;
        }

        var now = new Date();
        if (now.getTime() > temprepwd.outdate.getTime()) {
            msg.content = "链接已经失效!!";
            msg.status = 0;
            res.render('resetpwd', {
                title: '密码重置',
                msg: msg
            });
            return;
        }

        if (temprepwd.isvalid == 1) {
            msg.content = "链接已经用过一次了!!";
            msg.status = 0;
            res.render('resetpwd', {
                title: '密码重置',
                msg: msg
            });
            return;
        }

        var condition = {
            _id: token
        };
        var update = {
            $set: {
                pwd: util.md5_str(pwd),
                isvalid: 1
            }
        };
        var options = {
            multi: false
        };
        Repwd.update(condition, update, options, function(err, num) {
            if (err) {
                res.redirect('500');
            }
            if (num == 1) {
                var condition = {
                    email: email
                };
                var update = {
                    $set: {
                        pwd: util.md5_str(pwd)
                    }
                };
                var options = {
                    multi: false
                };
                UserDao.updateUserInfoFree(condition, update, options, function(err, num) {
                    if (err) {
                        res.redirect('/500')
                        return;
                    }
                    if (num === 1) {
                        msg.content = "密码重置成功!!";
                        msg.status = 1;
                        res.render('resetpwd', {
                            title: '密码重置',
                            msg: msg
                        });
                        return;
                    }
                });
            }
        });
    });
};