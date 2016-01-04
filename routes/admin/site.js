var	SiteDao = require('../../dao/sitedao'); 
var Site = require('../../models/site');  
var upload = require('.././upload');
var	ArticleDao = require('../../dao/articledao');
var	mongoose = require('mongoose');
var	EventProxy = require('eventproxy');
var path = require('path');
var config = require('../../config').config;
var UPYun = require('../../lib/upyun').UPYun;
var gm = require('gm')
,	fs = require('fs')
,	imageMagick = gm.subClass({ imageMagick : true });
 

/*
 * GET admin_addsite page.
 */
 exports.addsiteindex = function (req, res) { 	 
	return res.render('admin/addsite', { title:'新增SIte'});   
} 

/*
 * GET publish a new site
 */

 exports.addsite = function (req, res) {
 	var sname = req.query.sname;
 	var sdomain = req.query.sdomain;
 	var spic = req.query.spic;
 	var sbrief = req.query.sbrief;  
 	var sid = 0;
 	var ep = new EventProxy(); 
 	ep.assign("sid",function (sid) { 
		var site = new Site({ 
 				sid:sid, 
		        sname:sname,
		        sdomain:sdomain,
		        sbrief:sbrief,
		        spic:spic
 		});   
 		SiteDao.saveNewSite(site,function(err){ 	
 			var rspobj = {};
 			if(err){
 				rspobj.status = 1;
 			}else{
 				rspobj.status = 0;
 			}
 			SiteDao.getSiteByObj({sid:sid},function(err,data){
 				var _id = data._id;
				var domainRegex = new RegExp(sdomain, 'i');
 				ArticleDao.updateArticleInfo({title:domainRegex},{$set:{_sid:_id}},{upsert:false,multi: false },function(err){
 					res.json(rspobj);  
 				});
 			})
 		}); 
 	}) 

 	SiteDao.getMaxSid(function(err,maxsid){   
 		ep.emit("sid",maxsid);
 	})

 }; 

//图片上传
exports.sitepicupload = function(req, res) { 
	var temp_path = req.files.picture.path;	//获取用户上传过来的文件的当前路径
	var filename = req.files.picture.name;
	var sz = req.files.picture.size; 
	var maxWidth = 200;
	var maxHigh = 200;
	if (sz > 2*1024*1024) {
		fs.unlink(temp_path, function() {	//fs.unlink 删除用户上传的文件 
			var msg = {};
				msg.content = "请选择2M以下的图片!!";
				msg.status = 1;
			res.json(msg);
			return ;
		});
	}
	if (req.files.picture.type.split('/')[0] != 'image') {
		fs.unlink(temp_path, function() {
			var msg = {};
				msg.content = "请选择图片格式!!";
				msg.status = 1;
			res.json(msg);
			return ;
		});
	} 
 
	upload.resizeImageByMax(temp_path,temp_path,maxWidth,maxHigh,function(newpath){ 
		var upyun = new UPYun(config.upyun.bat, config.upyun.opname, config.upyun.oppwd);
	 	var fileContent = fs.readFileSync(newpath);  
	 	var upBase = config.upyun.siteurl; 
	 	var newFilename = filename; 
	 	var upAbsolute = '/site/'+newFilename;
		upyun.writeFile(upAbsolute, fileContent, false, function(err, data){
		    if (!err) {	        
				var msg = {};
				console.log(newFilename)
				msg.content = upBase+newFilename;	
				msg.status = 0;
				res.json(msg);
				console.log(msg);
				return ; 
		    }
		});
	})
	 	
};

//delete site
exports.delsite = function (req, res) { 
 	var sdeldomain = req.query.sdeldomain;  
	var siteLimit = {sdomain:sdeldomain};
	SiteDao.delSiteByObj(siteLimit,function(err,data){ 	
		var rspobj = {};
		if(err){
			rspobj.status = 0;
		}else{
			rspobj.status = 1;
		}
		res.json(rspobj);  
	});  

 }; 


//get site
exports.getsite = function (req, res) { 
 	var domainName = req.query.domainname;  
	var siteLimit = {sdomain:domainName};
	SiteDao.getSiteByObj(siteLimit,function(err,data){ 	
		var rspobj = {};
		if(err){
			rspobj.status = 1;
		}else{
			rspobj.status = 0;
			rspobj.site = data;
		}
		res.json(rspobj);  
	});  
 }; 

 exports.updatesiteindex = function (req, res) { 	 
	return res.render('admin/updatesite', { title:'更新Site'});   
} 

//update
exports.updatesite = function (req, res) { 
 	var sndomain = req.query.sndomain;  
 	var snname = req.query.snname;  
 	var snbrief = req.query.snbrief;  
 	var snpic = req.query.snpic;  
	var siteLimit = {sdomain:sndomain};
		var condition = {
 		sdomain:sndomain
 	},
 	update = {$set:{sname:snname,spic:snpic,sbrief:snbrief}},
 	options = {multi: false};
 	SiteDao.updateSite(condition,update,options,function(err,num){ 
		var rspobj = {};
		if(err){
			rspobj.status = 1;
		}else{
			if(num > 0){
				rspobj.status = 0; 
			}else{				
				rspobj.status = 1;
			}
		}
		res.json(rspobj);  
	});  
 };  