
var index = require('./routes/index');
var user = require('./routes/user');
var reg = require('./routes/register'); 
var login = require('./routes/login');
var logout = require('./routes/logout');
var forgetpwd = require('./routes/forgetpwd');
var pub = require('./routes/pubarticle');
var about = require('./routes/about'); 
var article = require('./routes/article');
var reply = require('./routes/reply');
var relation = require('./routes/relation');
var like = require('./routes/like');
var set = require('./routes/set');
var upload = require('./routes/upload');
var message = require('./routes/message');

var lost = require('./routes/common/404');
var error = require('./routes/common/500');
var search = require('./routes/search');

var run = function(app){
 
	app.get('*',function (req,res,next) {
		var originalUrl = req.originalUrl; 
		var site_noneed_login = ['/logout','/reply','/set/account','/set/avatar','/set','/message'];
		for(var i = 0 ;i < site_noneed_login.length ; i++){
			if(originalUrl === site_noneed_login[i]){
				if(!req.session.user){
					res.redirect('/');
					return ;
				}
				next();
				return;
			}
		} 
		next();
	});


	app.get('/', index.index); 

	//发表心情路由
	app.get('/pub', pub.save);
	app.get('/pubarticle', pub.complex);

	//注册路由
	app.get('/reg', reg.reg);
	app.post('/reg', reg.doreg);

	//登录路由 
	app.get('/login', login.login);
	app.post('/login', login.dologin);

	//找回密码路由
	app.get('/forgetpwd', forgetpwd.get);
	app.post('/forgetpwd', forgetpwd.sendmail);

	//登出路由
	app.get('/logout', logout.logout);


	//心情详细页面路由
	app.get('/article/:tid', article.detail);
	app.get('/deletearticle', article.delete);

	//回复心情路由
	app.post('/reply', reply.index);

	//个人中心
	app.get('/user/:username', user.index);

	//个人设置路由
	app.get('/set', set.baseDisplay);
	app.post('/set', set.doSetBaseInfo);
	app.get('/set/account', set.accountDisplay);
	app.post('/set/account', set.adoSetccountInfo);
	app.get('/set/avatar', set.avatarDisplay);


 
 	//关注与取消关注
 	app.get('/newrelation', relation.follow); 

 	app.get('/like',like.like);

 	app.get('/message',message.index);

 	//全站查找
 	app.get('/search',search.index);


 	app.post('/imgupload',upload.imgupload);
 	app.post('/save_avatar',upload.save_avatar);
 	app.post('/picupload',upload.picupload);


 	//关于/404/500页面路由
	app.get('/about', about.about);
 	app.get('/404', lost.index);
 	app.get('/500', error.index);


 	app.get('*', lost.index);
}
exports.run = run; 