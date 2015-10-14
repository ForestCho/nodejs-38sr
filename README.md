## 关于38sr
* 一个使用`nodejs`开发和`expressjs`框架的网站,数据库用的mongodb,用户可以通过网站发表心情，发表文章，以及喜欢的网址，网站支持评论以及消息系统，效果查看[38sr](http://38sr.com)
* 用它你可以建一个新闻站点，个人博客，内容管理系统
* 本项目是一个node，expressjs初学者的不错选择

##使用方法
* 将项目clone到本地，`git@github.com:ForestCho/nodejs-38sr.git`
* 安装模块依赖项 `npm install`
* 将`temp_config.js`更名为`config.js`
* 启动项目`node app.js`，在服务器上为了防止非正常关闭，可以用`forever start app.js`
* 通过`http://localhost:3000/`访问

##注意
* 目前使用的3.5版本express
* 系统的后台只提供简单的删除，未来的一些时间将增加一个后台系统，敬请关注
* 时间限制，代码有些乱，比如存在尚未删除的文件，注释不完整，也敬请原谅，也将是改善的地方
* 谢绝代码商用，如商用产生的后果自负

## 依赖模块
* express
* eventproxy
* connect-flash
* nodemailer
* mongoose
* validator
* ejs
* moment
* gm
* xss
* cheerio
* async
* xss-filters
* connect-redis
* ioredis
* lodash
* request