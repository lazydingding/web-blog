/*
   the start up file for the server
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var routes = require('./routes/index');
var settings = require('./settings');
//var users = require('./routes/users');

var app = express();

// here I used ejs as the template engine
app.set('views', path.join(__dirname, 'views'));
// change the view engine from ejs to html
app.engine('.html', require('ejs').__express);
// app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
   secret: settings.cookieSecret,
   key: settings.db, //cookie name
   cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //30 days
   store: new MongoStore({
      //url: 'mongodb://localhost/blog'
      db: settings.db,
      host: settings.host,
      port: settings.port
   })
}));

app.use(flash());

routes(app);

app.listen(app.get('port'), function() {
   console.log('Express server listening on port ' + app.get('port'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
  // res.render("404");
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
