var config = require('../config').config;

/*
 * 登出
 */
 exports.logout = function (req, res) {
  	req.session.destroy();
  	res.clearCookie(config.cookie_name, { path: config.cookie_path });
  	res.redirect('/'); 
 }; 