

var UPYun = require('./lib/upyun').UPYun;

var config = require('./config').config;
var upyun = new UPYun(config.upyun.bat, config.upyun.opname, config.upyun.oppwd); 
var upBase = config.upyun.photourl+'userName'+'/';  
var upAbsolute = '/photo/'+'userName'+'/';
upyun.mkDir(upAbsolute, true, function(err, data){
if (!err) {  
	console.log("suicccess")
}
console.log(err)
});		