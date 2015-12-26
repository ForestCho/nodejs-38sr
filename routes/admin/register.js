var UserDao = require('../../dao/userdao');
var fs = require('fs');
var UPYun = require('../../lib/upyun').UPYun;
var path = require('path');
var config = require('../../config').config;
var sanitize = require('validator');
var EventProxy = require('eventproxy');
var util = require('../../lib/util'); 
/*
 * GET register page.
 */
 
exports.reg = function(req, res) {
    res.render('admin/regmail', {
        title: '注册'
    });
};
exports.signup = function(req, res) {
    var token = req.query.token;
    var email = req.query.email;
    console.log(token+email);
    var name = email.substring(0, email.indexOf("@"));
    var obj = {
        _id: token,
        email: email
    };
    console.log(token+email);
    UserDao.getUserInfoByObj(obj, function(err, tempuser) { 
    console.log(token+email);
        if (tempuser) {
    console.log(token+email);
            res.render('admin/register', {
                title: '注册',
                email: email,
                name: name
            });
        }
    });
};
exports.regemail = function(req, res) {
    var email = req.query.email;
    var msg = {};
    var ep = new EventProxy();
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

    if (!reg.test(email)) {
        msg.content = "邮箱格式不对哦";
        msg.status = 0;
        res.json(msg);
    }

    var obj = {
        email: email
    };

    function semail() {
        UserDao.getUserInfoByEmail(email, function(err, tempuser) {

        console.log("4"+err);
            var emailTitle = "【38锶网】注册确认";
            var _id = tempuser._id;
            var redirectMail = "http://mail."+email.substring(email.indexOf('@')+1);
            var str1 = "<tr><td style='padding-top:30px'>你好:<br><br></td></tr>";
            var str2 = "<tr><td style='line-height:24px'><a href='mailto:" + email + "' target='_blank'>" + email + "</a> 在 <a href='http://38sr.com' target='_blank'>38sr.com</a> 创建了账号, 所以我们发送这封邮件进行确认.<br>请在 24 小时 内点击下面的链接来验证你的邮箱:<br><a href='http://38sr.com/admin/signup/?token=" + _id + "&email=" + email + "' title='立即激活' style='color:#c90000' target='_blank'>http://38sr.com/admin/signup/?token=" + _id + "&email=" + email + "</a></td></tr>";
            var str3 = "<tr><td style='padding:30px 0 30px 0;text-align:center'></td></tr>";
            var htmlContent = str1 + str2 + str3;

            var webContent = "<div class='text'>验证邮件已经发送到<span class='email'>" + email + "</span>，请<a href='"+redirectMail+"' target = '_blank' class = 'check-mail red-link' > 点击查收邮件 </a>激活账号。<br>没有收到激活邮件？请耐心等待</div > ";
            util.send_mail(email, emailTitle, htmlContent, function(error, response) {
                if (error) {
                    msg.content = "邮件发送失败 ";
                    msg.status = 0; 
                    res.json(msg);
                    return
                }

                msg.content = webContent;
                msg.status = 1; 
                res.json(msg);
                return
            });
        });
    }
    UserDao.getUserInfoByObj(obj, function(err, tempuser) { 
        if (err) {
            console.log("1"+err);
            res.redirect('/500');
            return;
        }
        if (tempuser) { 
            if (tempuser.isvalid == 1) {
                msg.content = "邮箱已注册";
                msg.status = 0;
                res.json(msg);
            }
            if (tempuser.isvalid == -1) {
                semail();
            }
        } else { 
            ep.emit("tempuser", tempuser);
        }
    });

    ep.assign("tempuser", function(tempuser) {
        UserDao.getNextUidOfUser(function(err, uid) {
            if (err) {
                console.log("2"+err);
                res.redirect('/500')
                return;
            };
            var user = new User({
                uid: uid,
                email: email,
                isvalid: -1
            });
            UserDao.saveNewUserObject(user, function(err) {
                if (err) {
                   console.log("3"+err);
                    res.redirect('500');
                }
                semail();

            });
        })
    });
};
exports.doreg = function(req, res) {
    var name = sanitize.trim(req.body.uname);
    var email = sanitize.trim(req.body.email); 
    var pwd = sanitize.trim(req.body.pwd);
    var pwdagain = req.body.pwdagain;
    var regAccount = /^[\u4E00-\u9FA5\uf900-\ufa2d\w]{4,16}$/;
    var msg = {};
    if (name === '' || email === '' || pwd === '') {
        msg.content = "ｏ（╯□╰）ｏ信息不能为空";
        msg.status = 0;
        res.render('admin/register', {
            title: '注册',
            msg: msg
        });
        return;
    }
    if (!regAccount.test(name)) {
        msg.content = "账号只能是4-16位的汉字，字符或者下划线";
        msg.status = 0;
        res.render('admin/register', {
            title: '注册',
            msg: msg
        });
        return;
    }
    if (pwd !== pwdagain) {
        msg.content = "ｏ（╯□╰）ｏ两次密码输入不一致";
        msg.status = 0;
        res.render('admin/register', {
            title: '注册',
            msg: msg
        });
        return;
    }


    var obj = { 
        email: email,
        isvalid:1
    };
    UserDao.getUserInfoByObj(obj, function(err, tempuser) { 
        if (err) {
            res.redirect('/500');
            return;
        }
        if (tempuser) {
            msg.content = "ｏ（╯□╰）ｏ您输入的邮箱已经被注册过了";
            msg.status = 0;
            res.render('admin/register', {
                title: '注册',
                msg: msg
            });
            return;
        }

        UserDao.getUserInfoByName(name, function(err, tempuser) {
            if (err) {
                res.redirect('/500');
                return;
            }
            if (tempuser) {
                msg.content = "ｏ（╯□╰）ｏ名字已经重复，请重新输入一个优雅的名字";
                msg.status = 0;
                res.render('admin/register', {
                    title: '注册',
                    msg: msg
                });
                return;
            }
            UserDao.getNextUidOfUser(function(err, uid) {
                if (err) {
                    res.redirect('/500')
                    return;
                };
                var upyun = new UPYun(config.upyun.bat, config.upyun.opname, config.upyun.oppwd);
                upyun.mkDir('/photo/' + name + '/', true, function(err, data) {
                    var defaultImagePath = config.upyun.photourl + 'default.jpg';

                    var condition = {
                        email: email
                    };
                    var update = {
                        $set: {
                            name: name,
                            pwd: util.md5_str(pwd),
                            originphoto: defaultImagePath,
                            photo: defaultImagePath,
                            isvalid: 1
                        }
                    };
                    var options = {
                        multi: false
                    };
                    UserDao.updateUserInfoFree(condition, update, options, function(err, num) {
                        if (err) {
                            res.redirect('500');
                        }
                        if (num == 1) {
                            msg.content = "注册成功<a href='/admin/login'>马上登录</a>";
                            msg.status = 1;
                            res.render('admin/login', {
                                title: '登陆',
                                msg: msg
                            });
                        }
                    });
                });
            })
        });
    });
};