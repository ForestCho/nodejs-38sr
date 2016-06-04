
var path = require('path');
var config = {
	site_name: '38sr.com',
	cookie_name: '38srweb',
	cookie_path: '/',
	session_secret: '38srweb',
	
	index: {
		list_article_size : 14,
		list_new_user_size :9,
		list_hot_user_size :9,
		list_link_size : 18,
		list_admin_article_size : 10
	},
	
	site:{
 		name: '38锶',
  		description: '38锶',
		keywords: '心情,小清新,有点意思,囧事,爆料',
  		author: 'caosl158'
	},

	mailhost: {
		host:"smtp.38sr.com",
		secureConnection:true,
		port:465,
		auth: {
			user:"test@38sr.com",
			pass: "test"
		}
	}, 
	upyun:{
		bat:  "srpic",
		opname:  "test_name",
		oppwd:  "test_pwd", 
		photourl:  "http://srpic.b0.upaiyun.com/photo/",
		cimgurl:  "http://srpic.b0.upaiyun.com/cimg/",
		siteurl:  "http://srpic.b0.upaiyun.com/site/",
		mryjurl:  "http://srpic.b0.upaiyun.com/mryj/"
			
	},
 	upload_img_dir: path.join(__dirname, 'public','userimg'),
 	rela_upload_img_dir: path.join('/userimg'),

	site_link:[
		{
			text:"Shulen`s Blog",
			link:"http://forestcho.github.io"
		},
		{
			text:"DigitalOcean",
			link:"https://www.digitalocean.com/?refcode=0f682e48abe3"
		},	
		{
			text:"羊城通余额查询",
			link:"http://www.38sr.com/yangchengtongv"
		}

	]
}


exports.config = config;