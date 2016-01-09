var SiteDao = require('../dao/sitedao');
var Site = require('../models/site');
var ArticleDao = require('../dao/articledao');
var mongoose = require('mongoose');
var EventProxy = require('eventproxy');
var path = require('path');
var config = require('../config').config;
var gm = require('gm'),
	fs = require('fs'),
	imageMagick = gm.subClass({
		imageMagick: true
	});
mongoose.connect('mongodb://caosl:123456@107.170.206.235:27017/blogdb');
/*
 * GET publish a new site
 */

var ep = new EventProxy();
var domainName = "www.cnblogs.com";
var siteLimit = {
	sdomain: domainName
};
SiteDao.getSiteByObj(siteLimit, function(err, data) {
	var _id = data._id;
	var domainRegex = new RegExp(domainName, 'i');
	ArticleDao.updateArticleInfo({
		title: domainRegex
	}, {
		$set: {
			_sid: _id
		}
	}, {
		upsert: false,
		multi: true
	}, function(err) {
		console.log("rspobj");
	});
});


var cc = function() {
	console.log("cc");
}
cc();