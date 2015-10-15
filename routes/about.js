/*
 * GET 关于页面.
 */
 exports.about = function (req, res) {
 	var curpath = '/about';
 	res.render('about', { title: '关于38SR',curpath:curpath });
  }; 

 /*
 * GET 时间线页面.
 */
 exports.shijian = function (req, res) {
 	var curpath = '/shijian';
 	res.render('shijian', { title: '38SR成长录',curpath:curpath });
  }; 
  