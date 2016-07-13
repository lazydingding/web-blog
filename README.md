# web-blog
多人博客网站, Node.js(Express) + MongoDb + Bootstrap

已部署到Heroku, [点击浏览](http://lazydingding.herokuapp.com/)

## 文件简介
* source: 程序源代码
* report.pdf: 开发流程报告

## 开发环境
* 系统环境: Mac Os 10.11.3
* Node.js: v4.3.2
* npm: v2.14.12
* Express: v4.13.1
* mongodb: v3.2.6

## 程序框架
Express [应用生成器](http://www.expressjs.com.cn/starter/generator.html)

## 如何本地运行
### 启动MongoDB数据库
* 下载MongoDB，[下载链接](https://www.mongodb.com/download-center#community)
* 解压缩下载包，重命名文件夹为mongodb
* 启动终端(命令提示符)，输入:
```
$ cd mongodb
$ mkdir blog
$ cd bin
$ ./mongod --dbpath ../blog/
```
### 运行server
* 启动另一个终端(命令提示符)，输入:
```
$ cd source
$ npm install
$ DEBUG=blog:∗ npm start
```
### 浏览页面
网页地址: [http://localhost:3000/](http://localhost:3000/)
