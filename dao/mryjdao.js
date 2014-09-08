var Mryj = require('../models/mryj'); 
var	util = require('../lib/util');

var getMryjOfCurrday = function(cb){	
 	var now = new Date();
	Mryj.findOne({create_at:{$gt: util.getStartOfCurrDay(now),$lt: util.getEndOfCurrDay(now)}},null,{sort:{'create_at':-1},limit:1},function(err,tempmryj){ 
 		var mryj = ' 在人生的漫漫旅途中，有时热烈，有时寂寞，有时高兴，有时忧伤...这里可以记录这一切';
 		if(tempmryj){
 			mryj = tempmryj.content;
 		}
 		cb(err,mryj); 
 	});
}

exports.getMryjOfCurrday = getMryjOfCurrday;