var Zymryj = require('../models/zymryj'); 
var	util = require('../lib/util');

/**
 * [getZymryjOfCurrday description]
 * @param  {Function} cb
 * @return {[type]}
 */
var getZymryjOfCurrday = function(cb){	
 	var now = new Date();
	Zymryj.findOne({create_at:{$gt: util.getStartOfCurrDay(now),$lt: util.getEndOfCurrDay(now)}},null,{sort:{'create_at':-1},limit:1},function(err,tempzymryj){ 
 	 	var zymryj={};
 		zymryj.cncontent = "不敢犯错，可能把一切都错过。";
 		zymryj.encontent = "You may miss everything if you dare not make mistakes.";
 		zymryj.img = "http://srpic.b0.upaiyun.com/mryj/1412436134767_RBSw2AowR5TDInst.jpg";
 	 	if(tempzymryj){ 
 			zymryj = tempzymryj;
 		}
 		cb(err,zymryj); 
 	});
}
//添加
/**
 * [saveNewZymryj description]
 * @param  {[type]}   cncontent
 * @param  {[type]}   encontent
 * @param  {[type]}   img
 * @param  {[type]}   create_at
 * @param  {Function} cb
 * @return {[type]}
 */
var saveNewZymryj = function(cncontent,encontent,img,create_at,cb){
	var zyItem = new Zymryj({  
	        cncontent:cncontent,
	        encontent:encontent,
	        img:img,
	        create_at:create_at
 		});  
	zyItem.save(cb);
}

exports.getZymryjOfCurrday = getZymryjOfCurrday;
exports.saveNewZymryj = saveNewZymryj;