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
	var userName = req.session.user.name;  
	var originPhoto = req.session.user.originphoto;
	var uid = req.session.user.uid;  
	var iconName = uid + '_' + '64'+'_'+'64'+ path.extname(originPhoto);
	var tempPath = path.resolve(path.join(config.upload_img_dir,iconName)); 
	imageMagick(originPhoto).crop(coords[2],coords[3],coords[0],coords[1]).scale(img_size,img_size).write(tempPath, function(err){
		if (err){
			console.log(err)
			res.redirect('common/500')
			return ;
		}; 
		var upyun = new UPYun(config.upyun.bat, config.upyun.opname, config.upyun.oppwd);
	 	var fileContent = fs.readFileSync(tempPath);  
	 	console.log(fileContent)
	 	var upBase = config.upyun.photourl+userName+'/'; 
	 	var userIconoPath = upBase+iconName;
	 	var upAbsolute = '/photo/'+userName+'/'+iconName ;
		upyun.writeFile(upAbsolute, fileContent, false, function(err, data){
		    if (!err) { 
				fs.unlink(tempPath, function() {
					update_avatar(userIconoPath,userName,function(err){
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
		    }
		console.log(err)
		});	
	});  
};

//图片上传
exports.picupload = function(req, res) { 
	var temp_path = req.files.picture.path;	//获取用户上传过来的文件的当前路径
	var filename = req.files.picture.name;
	var sz = req.files.picture.size;
	var username = req.session.user.name;
	var maxWidth = 500;
	var maxHigh = 500;
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
 
	resizeImageByMax(temp_path,temp_path,maxWidth,maxHigh,function(newpath){ 
		var upyun = new UPYun(config.upyun.bat, config.upyun.opname, config.upyun.oppwd);
	 	var fileContent = fs.readFileSync(newpath); 
	 	console.log(newpath);
	 	var upBase = config.upyun.cimgurl;
	 	var curTime = new Date();
	 	var newFilename = curTime.getTime()+'_'+filename; 
	 	var upAbsolute = '/cimg/'+newFilename;
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

//头像上传
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
	imageMagick(temp_path).size(function(err,size){ 
		var x_w_h = size.width/size.height; 
		var new_width = 160;
		var new_high  = 160;
		console.log(size);

		var upBase = config.upyun.photourl+username+'/';
	 	var curTime = new Date();
	 	var newFilename = curTime.getTime()+'_'+username+'_'+filename; 
	 	var bigphotopath = upBase+newFilename;
		var upAbsolute = '/photo/'+username+'/'+newFilename;
		var upyun = new UPYun(config.upyun.bat, config.upyun.opname, config.upyun.oppwd);
		if(size.width > 160 | size.height > 160){
			if(x_w_h > w_h || x_w_h === w_h){
				new_high = 1/x_w_h*160;
			}else{
				new_width = x_w_h*160;
			} 
			imageMagick(temp_path).resize(new_width, new_high, '!').autoOrient().write(temp_path, function(err){
				if (err) {
					console.log(err);
					res.end();
				} 
			 	var fileContent = fs.readFileSync(temp_path);   
				upyun.writeFile(upAbsolute, fileContent, false, function(err, data){ 
				    if (!err) {	      
						fs.unlink(temp_path, function() {
							update_originphoto(bigphotopath,username,function(err){
								if(!err){
									var msg = {};
										msg.content = "图片上传成功!!请刷新页面";
										msg.status = 1;
									req.flash('msg',msg); 
									res.redirect('/set/avatar');
									return ;
								}
							})
						});
				    }
				});		
			}); 
		}else{
		 	var fileContent = fs.readFileSync(temp_path);   
			upyun.writeFile(upAbsolute, fileContent, false, function(err, data){ 
			    if (!err) {	      
					fs.unlink(temp_path, function() {
						update_originphoto(bigphotopath,username,function(err){
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
			    }
			});	
		}
	}) 
};

//更新原始信息
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

function resizeImageByMax(temp_path,newpath,new_width,new_high,callback){
	imageMagick(temp_path).size(function(err,size){
		var x_w_h = size.width/size.height;   
		console.log(size)
		if(size.width > new_width | size.height > new_high){
			if(x_w_h > 1 || x_w_h === 1){
				new_high = 1/x_w_h*new_high;
			}else{
				new_width = x_w_h*new_width;
			}
			imageMagick(temp_path).resize(new_width, new_high, '!').autoOrient().write(newpath, function(err){
				if (err) {
					return;
				} 
				callback(newpath);
				return ;
			}); 
		}else{			
			callback(newpath);
			return ;
		} 
	}) 
}
exports.resizeImageByMax = resizeImageByMax;
//resizeImageByMax("/home/caosl/web/mongoblog/routes/nnweqb1.jpg",500,400);