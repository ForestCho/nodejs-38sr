var config = require('../config').config;
/*
 * GET search page.
 */

 exports.index = function (req, res) {
 	var searchstr = req.query.searchstr;
 	res.redirect('http://www.baidu.com/s?wd=site:'+config.site_name+' '+searchstr);
  }; 