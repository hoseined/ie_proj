var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var secret = "some random string used for jwt"
var User = require('./models/User')

var app = express();
var admin_urls = ['/forms/create/', '/add_polygon/','/get_all_forms/submited/' ]
var cors = require('cors')

app.use(cors())
app.use(function(req, res, next){
  console.log(admin_urls.indexOf(req.url),req.url)
  if (req.url === '/register/' || req.url === '/get_auth_token/'){
    next()
    return
  }
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return res.status(403).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded
    console.log(req.url,admin_urls)
    if (admin_urls.indexOf(req.url) !== -1 ||req.url.match('/get_all_forms/submited/.+')){
      if (!req.user.is_staff){
        res.status(401).send("you are not allowed to access this view");
        return
      }
    }
    next();
  } catch (ex) {
    res.status(403).send("Invalid token.");
    return
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
