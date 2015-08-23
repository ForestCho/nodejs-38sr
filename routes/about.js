/*
 * GET about page.
 */

 exports.about = function (req, res) {
 	var curpath = '/about';
 	res.render('about', { title: '关于38SR',curpath:curpath });
  }; 

 
 exports.shijian = function (req, res) {
 	var curpath = '/shijian';
 	res.render('shijian', { title: '38SR成长录',curpath:curpath });
  }; 
  