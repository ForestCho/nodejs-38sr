var path = require('path');
var config = require('../../config').config;
var UPYun = require('../../lib/upyun').UPYun;
var gm = require('gm')
,	fs = require('fs')
,	imageMagick = gm.subClass({ imageMagick : true });
 
//图片上传
/**
 * [uploadpic description]
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
exports.uploadpic = function(req, res) { 
	var temp_path = req.files.picture.path;	//获取用户上传过来的文件的当前路径
	var filename = req.files.picture.name;
	var sz = req.files.picture.size; 
	var maxWidth = 500;
	var maxHigh = 500;
	if (sz > 2*1024*1024) {
		console.log("fffff");
		fs.unlink(temp_path, function() {	//fs.unlink 删除用户上传的文件 
			var msg = {};
				msg.content = "请选择2M以下的图片!!";
				msg.status = 0;
		console.log("gggg");
			res.json(msg);
			return ;
		});
	} 
	resizeImageByMax(temp_path,temp_path,maxWidth,maxHigh,function(newpath){ 
		var upyun = new UPYun(config.upyun.bat, config.upyun.opname, config.upyun.oppwd);
	 	var fileContent = fs.readFileSync(temp_path); 
	 	var upBase = config.upyun.cimgurl;
	 	var curTime = new Date();
	 	var newFilename = curTime.getTime()+'_'+filename; 
	 	var upAbsolute = '/cimg/'+newFilename;
		upyun.writeFile(upAbsolute, fileContent, false, function(err, data){
		    if (!err) {	        
				var msg = {};
				console.log(newFilename)
				msg.content = upBase+newFilename;	
				msg.status = 1;
				res.json(msg);
				console.log(msg);
				return ; 
		    }
		});
	})	 	
};
 
 /**
  * [resizeImageByMax description]
  * @param  {[type]}   temp_path
  * @param  {[type]}   newpath
  * @param  {[type]}   new_width
  * @param  {[type]}   new_high
  * @param  {Function} callback
  * @return {[type]}
  */
 function resizeImageByMax(temp_path,newpath,new_width,new_high,callback){
	imageMagick(temp_path).size(function(err,size){
		console.log(size);
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