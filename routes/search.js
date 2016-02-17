var config = require('../config').config; 

/**
 * [index description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
 exports.index = function (req, res) {
 	var searchstr = req.query.searchstr;
 	res.redirect('http://www.baidu.com/s?wd=site:'+config.site_name+' '+searchstr);
  }; 