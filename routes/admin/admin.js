var Article = require('../../models/article'); 
var UserDao = require('../../dao/userdao');
var util = require('../../lib/util');
var Relation = require('../../models/relation');
var relationdao = require('../../dao/relationdao');
var EventProxy = require('eventproxy'); 
var moment = require('moment'); 

/**
 * [login description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.login = function(req, res) {
    return res.render('admin/login', {
        title: 'adminlogin'
    });
}

/**
 * [index description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.index = function(req, res) { 
    res.render('admin/index', {
        title: 'adminindex'
    }); 
} 