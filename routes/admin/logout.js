var config = require('../../config').config;


/**
 * [logout description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
 exports.logout = function (req, res) {
  	req.session.destroy();
  	res.clearCookie(config.cookie_name, { path: config.cookie_path });
  	res.redirect('/admin/login'); 
 }; 