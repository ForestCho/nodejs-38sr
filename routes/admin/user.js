var UserDao = require('../../dao/userdao'); 
var mongoose = require('mongoose');
var EventProxy = require('eventproxy');
var path = require('path');
var config = require('../../config').config; 


/**
 * [list description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.list = function(req, res) {
    var p = 1; //pageid 
    var curpath = "/admin/userlist"; 
    var pagesize = 14;
    var count = 0;
    if (req.query.p) {
        p = req.query.p;
    } 
    var userLimit = { 
    };
    var ep = new EventProxy();
    ep.assign("userlist", 'count', function(userlist, count) {
        var d = [];
        d.data = userlist;
        d.count = count;
        res.render('admin/userlist', {
            title: '用户列表',
            curpath: curpath,
            d: d,
            p: p
        });
    });

    UserDao.getNumberOUsersAsObect(userLimit, function(err, count) {
        ep.emit("count", count);
    });

    UserDao.getUserListLimitAsObject(true, p, pagesize, userLimit, function(err, userlist) { 
        ep.emit("userlist", userlist);
    })
};
