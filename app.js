
/**
 * Module dependencies.
 */

 var express = require('express');
 var http = require('http');
 var path = require('path');  
 var routes = require('./routes'); 
 var flash = require('connect-flash');
 var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser()); 
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(flash());
app.use(express.session({
	cookie: {
		path    : '/',
		httpOnly: false,
		maxAge  : 24*60*60*1000
	},
	secret: '1234567890QWERT'
}));


app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
app.use(require('./routes/login').user_auth);
app.use(app.router);


//路由
routes.run(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
