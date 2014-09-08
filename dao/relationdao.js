var Relation = require('../models/relation')
User = require('../models/user'),
EventProxy = require('eventproxy'); 

var getListOfFollowersByName = function(uname,callback){
	var displaySize = 6;
	var ep = new EventProxy();
	ep.assign("userinfo",function(userinfo){ 
			Relation.find({fuid:userinfo.uid}).sort({'create_date':-1}).limit(displaySize).populate('_uid_info').exec(function(err,follerlist){
				callback(err,follerlist);
			});
	});	

	User.findOne({name:uname},function(err,userinfo){
		if(err){
			res.redirect('/500');
		} 
		if(userinfo){	  	 
			ep.emit("userinfo",userinfo);
		}
	}); 
} 

var getListOfHeFollowsByName = function(uname,callback){
	var displaySize = 6;
	var ep = new EventProxy();
	ep.assign("userinfo",function(userinfo){ 
			Relation.find({uid:userinfo.uid}).sort({'create_date':-1}).limit(displaySize).populate('_fuid_info').exec(function(err,follerlist){
				callback(err,follerlist);
			});
	});	

	User.findOne({name:uname},function(err,userinfo){
		if(err){
			res.redirect('/500');
		} 
		if(userinfo){	  		
			ep.emit("userinfo",userinfo);
		}
	}); 
} 

exports.getListOfFollowersByName = getListOfFollowersByName;
exports.getListOfHeFollowsByName = getListOfHeFollowsByName;