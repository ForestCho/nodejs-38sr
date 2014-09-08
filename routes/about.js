/*
 * GET about page.
 */

 exports.about = function (req, res) {
 	res.render('about', { title: '关于38Sr' });
  }; 