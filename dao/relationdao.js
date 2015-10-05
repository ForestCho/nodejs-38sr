var Relation = require('../models/relation')
User = require('../models/user'),
EventProxy = require('eventproxy'); 

var getListOfFollowersByUid = function(uid,callback){ 
	var displaySize = 6; 
	Relation.find({fuid:uid}).sort({'create_date':-1}).limit(displaySize).populate('_uid_info').exec(function(err,follerlist){
		callback(err,follerlist);
	}); 
} 
var getListOfAllFollowersByUid = function(uid,callback){ 
	var displaySize = 6; 
	Relation.find({fuid:uid}).sort({'create_date':-1}).populate('_uid_info').exec(function(err,follerlist){
		callback(err,follerlist);
	}); 
} 
var getNumberOfFollowersByUid = function(uid,callback){  
	Relation.count({fuid:uid},callback);
} 

var countByName = function(uname,funame,callback){ 
	var ep = new EventProxy();
	ep.assign("userinfo","fuserinfo",function(userinfo,fuserinfo){ 
			Relation.count({uid:userinfo.uid,fuid:fuserinfo.uid},callback);
	});	 
	User.findOne({name:uname},function(err,userinfo){
		if(err){
			res.redirect('/500');
		} 
		if(userinfo){	  	 
			ep.emit("userinfo",userinfo);
		}
	}); 
	User.findOne({name:funame},function(err,fuserinfo){
		if(err){
			res.redirect('/500');
		} 
		if(fuserinfo){	  	 
			ep.emit("fuserinfo",fuserinfo);
		}
	}); 
} 

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
var getListOfAllFollowersByName = function(uname,callback){ 
	var ep = new EventProxy();
	ep.assign("userinfo",function(userinfo){ 
			Relation.find({fuid:userinfo.uid}).sort({'create_date':-1}).populate('_uid_info').exec(function(err,follerlist){
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

var getNumberOfFollowersByName = function(uname,callback){    
	var ep = new EventProxy();
	ep.assign("userinfo",function(userinfo){ 
		Relation.count({fuid:userinfo.uid},callback);  
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


var getListOfHeFollowsByUid = function(uid,callback){
	var displaySize = 6; 
	Relation.find({uid:uid}).sort({'create_date':-1}).limit(displaySize).populate('_fuid_info').exec(function(err,follerlist){
		callback(err,follerlist);
	}); 
} 
var getListOfAllHeFollowsByUid = function(uid,callback){ 
	Relation.find({uid:uid}).sort({'create_date':-1}).populate('_fuid_info').exec(function(err,follerlist){
		callback(err,follerlist);
	}); 
} 
var getNumberOfHeFollowersByUid = function(uid,callback){  
	Relation.count({uid:uid},callback);
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

var getListOfAllHeFollowsByName = function(uname,callback){ 
	var ep = new EventProxy();
	ep.assign("userinfo",function(userinfo){ 
			Relation.find({uid:userinfo.uid}).sort({'create_date':-1}).populate('_fuid_info').exec(function(err,follerlist){
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

var getNumberOfHeFollowersByName = function(uname,callback){   
	var displaySize = 6;
	var ep = new EventProxy();
	ep.assign("userinfo",function(userinfo){ 
		Relation.count({uid:userinfo.uid},callback);  
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

exports.getNumberOfFollowersByUid = getNumberOfFollowersByUid;
exports.getNumberOfFollowersByName = getNumberOfFollowersByName;
exports.getNumberOfHeFollowersByUid = getNumberOfHeFollowersByUid;
exports.getNumberOfHeFollowersByName = getNumberOfHeFollowersByName;

exports.getListOfFollowersByName = getListOfFollowersByName;
exports.getListOfHeFollowsByName = getListOfHeFollowsByName;
exports.getListOfFollowersByUid = getListOfFollowersByUid;
exports.getListOfHeFollowsByUid = getListOfHeFollowsByUid;


exports.getListOfAllFollowersByName = getListOfAllFollowersByName;
exports.getListOfAllHeFollowsByName = getListOfAllHeFollowsByName;
exports.getListOfAllFollowersByUid = getListOfAllFollowersByUid;
exports.getListOfAllHeFollowsByUid = getListOfAllHeFollowsByUid;

exports.countByName = countByName;


