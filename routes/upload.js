var path = require('path');
var config = require('../config').config;
var UPYun = require('../lib/upyun').UPYun;
var gm = require('gm')
,	fs = require('fs')
,	imageMagick = gm.subClass({ imageMagick : true });

//do img upload and edit photo
//
exports.save_avatar = function(req, res) { 
	var coords = req.body.coords.split('_');
	var img_size = 64;
	console.log(coords);
	var username = req.session.user.name;  
	var originphoto = req.session.user.originphoto;
	var uid = req.session.user.uid;  
	var new_filename = uid + '_' + '64*64'+ path.extname(originphoto);
	var imgpath = path.join(config.upload_img_dir,username);
	var originphoto_path = path.join(imgpath,path.basename(originphoto));
	var savepath = path.resolve(path.join(imgpath,new_filename));
	var relapath = path.join(config.rela_upload_img_dir,username,new_filename);  
	imageMagick(originphoto_path).crop(coords[2],coords[3],coords[0],coords[1]).scale(img_size,img_size).write(savepath, function(err){
		if (err){
			res.redirect('common/500')
			return ;
		};  
		update_avatar(relapath,username,function(err){
			if (err){
				res.redirect('common/500')
				return ;
			};   
			var msg = {};
				msg.content = "头像修改成功!!";
				msg.status = 1;
			req.flash('msg',msg);
			res.redirect('/set/avatar'); 
		}) 
	});  
};

exports.picupload = function(req, res) { 
	var temp_path = req.files.picture.path;	//获取用户上传过来的文件的当前路径
	var filename = req.files.picture.name;
	var sz = req.files.picture.size;
	var username = req.session.user.name;
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

 	var upyun = new UPYun("srpic", "caosl158", "csl123456");
 	var fileContent = fs.readFileSync(temp_path); 
 	var upBase = 'http://srpic.b0.upaiyun.com/cimg/';
 	var curTime = new Date();
 	var newFilename = curTime.getTime()+'_'+filename;
	upyun.writeFile('/cimg/'+newFilename, fileContent, false, function(err, data){
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
};
exports.imgupload = function(req, res) { 
	var temp_path = req.files.img.path;	//获取用户上传过来的文件的当前路径
	var filename = req.files.img.name;
	var sz = req.files.img.size;
	var username = req.session.user.name;
	if (sz > 2*1024*1024) {
		fs.unlink(temp_path, function() {	//fs.unlink 删除用户上传的文件 
			var msg = {};
				msg.content = "请选择2M以下的图片!!";
				msg.status = 1;
			req.flash('msg',msg); 
			res.redirect('/set/avatar'); 
			return ;
		});
	}
	if (req.files.img.type.split('/')[0] != 'image') {
		fs.unlink(temp_path, function() {
			var msg = {};
				msg.content = "请选择图片格式!!";
				msg.status = 1;
			req.flash('msg',msg); 
			res.redirect('/set/avatar'); 
			return ;
		});
	} 

	var w_h = 160/160;
	var new_filename = Date.now() + '_' + filename;
	var imgpath = path.join(config.upload_img_dir,username);
	var savepath = path.resolve(path.join(imgpath,new_filename));
	var relapath = path.join(config.rela_upload_img_dir,username,new_filename);
	imageMagick(temp_path).size(function(err,size){
		var x_w_h = size.width/size.height; 
		var new_width = 160;
		var new_high  = 160;

		if(size.width > 160 | size.height > 160){
			if(x_w_h > w_h || x_w_h === w_h){
				new_high = 1/x_w_h*160;
			}else{
				new_width = x_w_h*160;
			}
				imageMagick(temp_path).resize(new_width, new_high, '!').autoOrient().write(savepath, function(err){
					if (err) {
						console.log(err);
						res.end();
					}
					fs.unlink(temp_path, function() {
						update_originphoto(relapath,username,function(err){
							if(!err){
								var msg = {};
									msg.content = "图片上传成功!!";
									msg.status = 1;
								req.flash('msg',msg); 
								res.redirect('/set/avatar');
								return ;
							}
						})
					});
				}); 
		}
	}) 
};

var update_originphoto = function(ourl,username,callback){
	var condition = {
		name:username
	};
	var update = {$set:{originphoto:ourl}};
	var options = { multi: false };
	User.update(condition,update,options,function(err,num){
		if (err){
			res.redirect('common/500')
			return ;
		};    
		callback(null)
	});
}

var update_avatar = function(url,username,callback){
	var condition = {
		name:username
	};
	var update = {$set:{photo:url}};
	var options = { multi: false };
	User.update(condition,update,options,function(err,num){
		if (err){
			res.redirect('common/500')
			return ;
		};    
		callback(null)
	});
}