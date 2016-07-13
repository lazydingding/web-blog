/*
   index.js is responsible for routing control and routing function implement

   routing planning summary:
   /: homepage,
   /reg: users register,
   /login: users login,
   /post: write blog,
   /logout: users logout,
   /archive: the summary page of blogs,
   /tags: the summary page of tage,
   /p: the blog page,
   /edit: edit exist blog,
   /remove: delete exist blog,
   /u: the user page,
   /uploadImg: upload img though the KindEditor
*/

// crypto used for create hashed value for password
var crypto = require('crypto');
// formidable used for upload images
var formidable = require('formidable');

var User = require('../models/user.js');
var Post = require('../models/post.js');
var Comment = require('../models/comment.js');


module.exports = function(app) {
   app.get('/', function (req, res) {
      Post.getAll(null, function (err, posts) {
         if (err) {
            posts = [];
         }
         res.render('index', {
            title: 'Homepage',
            user: req.session.user,
            posts: posts,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
         });
      });
   });

   app.get('/reg', checkNotLogin);
   app.get('/reg', function (req, res) {
      res.render('reg', {
         title: 'Register',
         user: req.session.user,
         success: req.flash('success').toString(),
         error: req.flash('error').toString()
      });
   });

   app.post('/reg', checkNotLogin);
   app.post('/reg', function (req, res) {
      var name = req.body.name;
      var password = req.body.password;
      var password_re = req.body['password-repeat'];
      // if the two password input not match, show the err message
      if (password_re != password) {
         req.flash('error', 'The two passwords you typed do not match!');
         return res.redirect('/reg');
      }
      // password encryption
      var md5 = crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('hex');
      var newUser = new User({
         name: name,
         password: password,
         email: req.body.email
      });
      User.get(newUser.name, function (err, user) {
         if (err) {
            req.flash('error', err);
            return res.redirect('/');
         }
         if (user) {
            req.flash('error', 'User already exist!');
            return res.redirect('/reg');
         }
         newUser.save(function (err, user) {
            if (err) {
               req.flash('error', err);
               return res.redirect('/reg');
            }
            req.session.user = user;
            req.flash('success', 'Register success!');
            res.redirect('/');
         });
      });
   });

   app.get('/login', checkNotLogin);
   app.get('/login', function (req, res) {
      res.render('login', {
         title: 'Login',
         user: req.session.user,
         success: req.flash('success').toString(),
         error: req.flash('error').toString()
      });
   });

   app.post('/login', checkNotLogin);
   app.post('/login', function (req, res) {
      var md5 = crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('hex');
      User.get(req.body.name, function (err, user) {
         if (!user) {
            req.flash('error', 'User does not exist!');
            return res.redirect('/login');
         }
         if (user.password != password) {
            req.flash('error', 'Password error!');
            return res.redirect('/login');
         }
         req.session.user = user;
         req.flash('success', 'Login success!');
         res.redirect('/');
      });
   });

   app.get('/post', checkLogin);
   app.get('/post', function (req, res) {
      res.render('post', {
         title: 'Post',
         user: req.session.user,
         success: req.flash('success').toString(),
         error: req.flash('error').toString()
      });
   });

   app.post('/post', checkLogin);
   app.post('/post', function (req, res) {
      var currentUser = req.session.user;
      var tags = [req.body.tag1, req.body.tag2, req.body.tag3];
      var post = new Post(currentUser.name, req.body.title, tags, req.body.post);
      post.save(function (err) {
         if (err) {
            req.flash('error', err);
            return res.redirect('/');
         }
         req.flash('success', 'Post success!');
         // success and redirect to homepage
         res.redirect('/');
      });
   });

   app.get('/logout', checkLogin);
   app.get('/logout', function (req, res) {
      req.session.user = null;
      req.flash('success', 'Logout success!');
      res.redirect('/');
   });

   app.get('/archive', function (req, res) {
      Post.getArchive(function (err, posts) {
         if (err) {
            req.flash('error', err);
            return res.redirect('/');
         }
         res.render('archive', {
            title: 'Archive',
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
         });
      });
   });

   app.get('/tags', function (req, res) {
      Post.getTags(function (err, posts) {
         if (err) {
            req.flash('error', err);
            return res.redirect('/');
         }
         res.render('tags', {
            title: 'Tags',
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
         });
      });
   });

   app.get('/tags/:tag', function (req, res) {
      Post.getTag(req.params.tag, function (err, posts) {
         if (err) {
            req.flash('error',err);
            return res.redirect('/');
         }
         res.render('tag', {
            title: 'TAG:' + req.params.tag,
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
         });
      });
   });

   app.get('/u/:name', function (req, res) {
      // check if the user exist
      User.get(req.params.name, function (err, user) {
         if (!user) {
            req.flash('error', 'User does not exist!');
            // if user does not exist, redirect to homepage
            return res.redirect('/');
         }
         // fetch all the post that posted by this user
         Post.getAll(user.name, function (err, posts) {
            if (err) {
               req.flash('error', err);
               return res.redirect('/');
            }
            res.render('user', {
               title: user.name,
               posts: posts,
               user : req.session.user,
               success : req.flash('success').toString(),
               error : req.flash('error').toString()
            });
         });
      });
   });

   app.get('/p/:_id', function (req, res) {
      Post.getOne(req.params._id, function (err, post) {
         if (err) {
            req.flash('error', err);
            return res.redirect('/');
         }
         res.render('article', {
            title: post.title,
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
         });
      });
   });

   app.post('/p/:_id', function (req, res) {
      var date = new Date();
      var time = date.getFullYear() + "-" + (date.getMonth() + 1) +
      "-" + date.getDate() + " " + date.getHours() + ":" +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      var comment = {
         name: req.body.name,
         email: req.body.email,
         time: time,
         content: req.body.content
      };
      var newComment = new Comment(req.params._id, comment);
      newComment.save(function (err) {
         if (err) {
            req.flash('error', err);
            return res.redirect('back');
         }
         req.flash('success', 'Comment success!');
         res.redirect('back');
      });
   });

   app.get('/edit/:_id', checkLogin);
   app.get('/edit/:_id', function (req, res) {
      var currentUser = req.session.user;
      Post.edit(req.params._id,
      function (err, post) {
         if (err) {
            req.flash('error', err);
            return res.redirect('back');
         }
         res.render('edit', {
            title: 'Edit',
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
         });
      });
   });

   app.post('/edit/:_id', checkLogin);
   app.post('/edit/:_id', function (req, res) {
      var currentUser = req.session.user;
      Post.update(req.params._id,
      req.body.post, function (err) {
         if (err) {
            return res.redirect('/');
         }
         req.flash('success', 'Edit success!');
         res.redirect('/');
      });
   });

   app.get('/remove/:_id', checkLogin);
   app.get('/remove/:_id', function (req, res) {
      var currentUser = req.session.user;
      Post.remove(req.params._id,
      function (err) {
         if (err) {
            req.flash('error', err);
            return res.redirect('back');
         }
         req.flash('success', 'Delete success!');
         res.redirect('/');
      });
   });

   app.post('/uploadImg', function(req, res, next) {
      var form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.uploadDir = __dirname + '/../public/images';
      form.parse(req, function (err, fields, files) {
         if (err) {
               throw err;
            }
         var image = files.imgFile;
         var path = image.path;
         path = path.replace('/\\/g', '/');
         var url = '/images' + path.substr(path.lastIndexOf('/'), path.length);
         var info = {
            "error": 0,
            "url": url
         };
         res.send(info);
      });
   });

   function checkLogin(req, res, next) {
      if (!req.session.user) {
         req.flash('error', 'Not logged in!');
         res.redirect('/login');
      }
      next();
   }

   function checkNotLogin(req, res, next) {
      if (req.session.user) {
         req.flash('error', 'Already logged in');
         res.redirect('back');
      }
      next();
   }
};
