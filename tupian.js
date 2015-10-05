var path = require('path');
var config = require('../config').config; 
var async = require('async');
var gm = require('gm')
,	fs = require('fs')
,	imageMagick = gm.subClass({ imageMagick : true });

//do img upload and edit photo 

//头像上传
var resize = function() { 
 	var temp_path
 	var filedir = "/media/多媒体/每日一句图片";
 	var files = fs.readdirSync(filedir); 
	var length = files.length;
	var index = 0;
	async.whilst(
	      function () { return index < length; },
	      function (callback) { 	
	      	temp_path = filedir+'/'+files[index];
	      	imageMagick(temp_path).size(function(err,size){ 
			imageMagick(temp_path).resize(480, 256, '!').autoOrient().write(temp_path, function(err){
				if (err) {
					console.log(err); 
				} 
			});  
			}) 
	        index++;
	        setTimeout(callback, 2000);
	      },
	      function (err) { 
	      }
	); 
};

resize();
 