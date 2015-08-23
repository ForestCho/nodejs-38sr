## 关于38sr
一个使用nodejs开发和expressjs框架的网站
用户可以通过网站发表心情，发表文章，以及喜欢的网址，
网站支持评论以及消息系统，
效果查看[38sr](http://38sr.com)
##使用方法
* 将项目clone到本地，`git@github.com:ForestCho/38sr.git`
* 安装模块依赖项 `npm install`
* 启动项目`node app.js`，在服务器上为了防止非正常关闭，可以用`forever start app.js`
* 通过`http://localhost:3000/`访问

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
* request":"2.58.0"