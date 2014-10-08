
var path = require('path');
var config = {
	site_name: '38sr.com',
	cookie_name: '38srweb',
	cookie_path: '/',
	session_secret: '38srweb',
	
	index: {
		list_article_size : 8,
		list_new_user_size :9,
		list_hot_user_size :9
	},
	
	site:{
 		name: '38锶',
  		description: '38锶',
		keywords: '心情,小清新,有点意思,朋友',
  		author: 'caosl158'
	},

	mailhost: {
		host:"smtp.38sr.com",
		secureConnection:true,
		port:465,
		auth: {
			user:"forest@38sr.com",
			pass: "caosl910417"
		}
	}, 
	upyun:{
		bat:  "srpic",
		opname:  "caosl158",
		oppwd:  "csl123456", 
		photourl:  "http://srpic.b0.upaiyun.com/photo/",
		cimgurl:  "http://srpic.b0.upaiyun.com/cimg/",
		mryjurl:  "http://srpic.b0.upaiyun.com/mryj/"
			
	},
 	upload_img_dir: path.join(__dirname, 'public','userimg'),
 	rela_upload_img_dir: path.join('/userimg'),

	site_link:[
		{
			text:"Forest Blog",
			link:"http://blog.yidongzhifu.net"
		},
		{
			text:"雨燕社区",
			link:"http://www.cswift.cn"
		},	
		{
			text:"38锶",
			link:"http://www.38sr.com"
		}

	]
}


exports.config = config;