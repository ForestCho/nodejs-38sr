var config = require('../config').config;
/*
 * GET do logout page.
 */

 exports.logout = function (req, res) {
  	req.session.destroy();
  	res.clearCookie(config.cookie_name, { path: config.cookie_path });
  	res.redirect('/'); 
 }; 