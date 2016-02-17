/**
 * [about 关于页面]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.about = function (req, res) {
	var curpath = '/about';
	res.render('about', { title: '关于38SR',curpath:curpath });
}; 
 
/**
 * [shijian 时间线页面]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.shijian = function (req, res) {
	var curpath = '/shijian';
	res.render('shijian', { title: '38SR成长录',curpath:curpath });
}; 
 
 