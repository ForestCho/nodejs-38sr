var index = require('./routes/index'); 
var tag = require('./routes/tag'); 
var locate = require('./routes/locate'); 
var site = require('./routes/site'); 
var user = require('./routes/user');
var userarticle = require('./routes/userarticle');
var reg = require('./routes/register'); 
var login = require('./routes/login');
var logout = require('./routes/logout');
var forgetpwd = require('./routes/forgetpwd');
var pub = require('./routes/pubarticle');
var publink = require('./routes/publink');
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
var feedback = require('./routes/feedback');

//管理权限
var admin_reg = require('./routes/admin/register'); 
var admin_logout = require('./routes/admin/logout');
var admin_forgetpwd = require('./routes/admin/forgetpwd');
var admin_login = require('./routes/admin/login'); 
var admin_admin = require('./routes/admin/admin');
var admin_article = require('./routes/admin/article');
var admin_site = require('./routes/admin/site');

 

//手机端
var xqjson = require('./routes/mobile/xqjson');
var catajson = require('./routes/mobile/catajson');
var mryjjson = require('./routes/mobile/mryjjson'); 
var loginjson = require('./routes/mobile/loginjson'); 
var registerjson = require('./routes/mobile/registerjson'); 
var writejson = require('./routes/mobile/writejson');
var replyjson = require('./routes/mobile/replyjson');
var uploadjson = require('./routes/mobile/uploadjson');
var articlejson = require('./routes/mobile/articlejson');
var likejson = require('./routes/mobile/likejson');
var userjson = require('./routes/mobile/userjson');
var userarticlejson = require('./routes/mobile/userjson');

//小功能路由
var yangchengtong = require('./routes/other/yangchengtong');  
var weixin = require('./routes/other/weixin');

var run = function(app){ 
	app.get('*',function (req,res,next) {
		var originalUrl = req.originalUrl; 
		var site_login_pass = ['/logout','/reply','/set/account','/set/avatar','/set','/message'];
		var site_login_refuse = ['/login','/reg'];
		var site_admin = ['/admin/index','/admin/addsiteindex','/admin/updatesiteindex','/admin/addarticle','/admin/list'];
		for(var i = 0 ;i < site_login_pass.length ; i++){
			if(originalUrl === site_login_pass[i]){
				if(!req.session.user){
					res.redirect('/');
					return ;
				}
				next();
				return;
			}
		} 
		for(var i = 0 ;i < site_login_refuse.length ; i++){
			if(originalUrl === site_login_refuse[i]){
				if(req.session.user){
					res.redirect('/');
					return ;
				}
				next();
				return;
			}
		} 			
		for(var i = 0 ;i < site_admin.length ; i++){ 
			if(originalUrl === site_admin[i]){
				if(!req.session.user){
					res.redirect('/admin/login');
					return ;
				}
				if(req.session.user.admin == 0){
					res.redirect('/admin/login');
					return ;					
				}
				next();
				return;
			}
		} 
		next();
	});


　//********************************************************************//
　//*************************网站主功能********************************//
　//********************************************************************// 
	//网站路由
	app.get('/', index.index); 
	app.get('/mood', index.mood); 
	app.get('/article', index.article); 
	app.get('/fastlink', index.fastlink); 
	app.get('/xiaohua', index.xiaohua); 
	app.get('/tag/:tagname', tag.index);
	app.get('/tags/:tagname', tag.index);
	app.get('/locate/:locatename', locate.index);
	app.get('/site/:site_id', site.index);

	//注册路由
	app.get('/reg', reg.reg);
	app.post('/reg', reg.doreg);
	app.get('/signup',reg.signup);
	app.get('/regemail',reg.regemail);
	//登录路由 
	app.get('/login', login.login);
	app.post('/login', login.dologin);
	app.get('/getphoto', user.getuserinfobyname); 

	//找回密码路由
	app.get('/sendmail', forgetpwd.get);
	app.post('/sendmail', forgetpwd.sendmail);
	app.get('/resetpwd', forgetpwd.resetpwd);
	app.post('/resetpwd', forgetpwd.doreset);

	//登出路由
	app.get('/logout', logout.logout);

	//心情详细页面路由
	app.get('/article/:tid', article.detail);
	app.get('/t/:tid', article.detail); //new version
	app.get('/deletearticle', article.delete);

	//回复心情路由
	app.post('/reply', reply.index);

	//个人中心
	app.get('/userinfo', user.getuserinfo); 
	app.get('/user/:username', user.cata); 
	app.get('/user/:username/:cata', user.cata); 
	/*app.get('/user/:username/article', userarticle.index);*/
	app.get('/:username/follower', user.getfollower);
	app.get('/:username/hefollower', user.gethefollower);

	//个人设置路由
	app.get('/set', set.baseDisplay);
	app.post('/set', set.doSetBaseInfo);
	app.get('/set/account', set.accountDisplay);
	app.post('/set/account', set.adoSetccountInfo);
	app.get('/set/avatar', set.avatarDisplay);
 
 	//关注与取消关注
 	app.get('/newrelation', relation.follow);  
 	//喜欢提交地址
 	app.get('/like',like.like);
 	//消息页面
 	app.get('/message',message.index);

 	//全站查找
 	app.get('/search',search.index);

 	//头像上传
 	app.post('/imgupload',upload.imgupload);
 	//头像修改保存
 	app.post('/save_avatar',upload.save_avatar);
 	//图片上传
 	app.post('/picupload',upload.picupload);

 	//关于页面 	
	app.get('/about', about.about);
	//时间线页面
	app.get('/shijian', about.shijian);
	app.get('/feedback', feedback.index);
	app.post('/fb', feedback.dofb);

 	//关于404-500页面路由
 	app.get('/404', lost.index);
 	app.get('/500', error.index);

	//发表页面
	app.get('/pub', pub.index);
	//发表心情提交地址
	app.post('/puba', pub.save);

 	//发表链接提交地址　
 	app.get('/publ',publink.save);

 	//点击快链快转
 	app.get('/redirect',publink.redirect)

 	//获取链接title提交地址
 	app.get('/getlinktitle',publink.getlinktitle);


　//********************************************************************//
　//**********************＊***以下为手机端********************************//
　//********************************************************************// 
	//手机app请求
 	app.get('/xqjson', xqjson.index); 
	app.get('/xiaohuajson', catajson.xiaohua);
	app.get('/yulejson', catajson.yule);
	app.get('/baoliaojson', catajson.baoliao);
	app.get('/qingganjson', catajson.qinggan);
	app.get('/qiongshijson', catajson.qiongshi); 
	app.get('/mryjjson', mryjjson.index);   
	app.post('/loginjson', loginjson.dologin);
	app.post('/registerjson', registerjson.doregister);
	app.post('/sinaregisterjson', registerjson.dosinaregister);
	app.post('/qqregisterjson', registerjson.doqqregister);	
	app.get('/writejson', writejson.dowrite);
	app.get('/replylistjson', replyjson.getreplylist); 
	app.post('/replyjson', replyjson.doreply); ;
	app.post('/uploadjson', uploadjson.uploadpic); 
	app.get('/detailjson', articlejson.getdetail); 
	app.get('/likejson', likejson.like); 
	app.get('/userjson', userjson.index); 
	app.get('/userarticlejson', userjson.articlelist); 



　//********************************************************************//
　//**********************＊***以下为管理路由********************************//
　//********************************************************************//  
    //登录注册等账户管理
    app.get('/admin/login', admin_login.login);
    app.post('/admin/login', admin_login.dologin); 
    app.get('/admin/reg', admin_reg.reg);
    app.post('/admin/reg', admin_reg.doreg);
    app.get('/admin/regemail', admin_reg.regemail);
    app.get('/admin/signup', admin_reg.signup); 
    app.get('/admin/sendmail', admin_forgetpwd.get);
    app.post('/admin/sendmail', admin_forgetpwd.sendmail);
    app.get('/admin/resetpwd', admin_forgetpwd.resetpwd);
    app.post('/admin/resetpwd', admin_forgetpwd.doreset);
    app.get('/admin/logout', admin_logout.logout);


    app.get('/admin/index', admin_admin.index);

    //文章管理
    app.get('/admin/list', admin_article.list);
    app.get('/admin/addarticle', admin_article.addarticle);
    app.post('/admin/savearticle', admin_article.save); 
    app.get('/admin/deletearticle', admin_article.delete); 
    app.get('/admin/getarticle/:tid', admin_article.getarticle); 
    app.post('/admin/updatearticle', admin_article.updatearticle); 
 
 	//site管理
    app.get('/admin/getsite', admin_site.getsite);
    app.get('/admin/updatesiteindex', admin_site.updatesiteindex);
    app.get('/admin/updatesite', admin_site.updatesite);
    app.get('/admin/addsiteindex', admin_site.addsiteindex);
    app.get('/admin/addsite', admin_site.addsite);
    app.get('/admin/delsite', admin_site.delsite);
 	app.post('/admin/sitepicupload',admin_site.sitepicupload);


　//********************************************************************//
　//*************************小功能路由********************************//
　//********************************************************************// 　
	app.get('/yangchengtong', yangchengtong.index);
	app.get('/yangchengtongv', yangchengtong.view);  
	app.get('/weixin',weixin.test)
 	app.get('*', lost.index);
}
exports.run = run; 