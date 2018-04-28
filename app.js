const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const hbs = require('hbs');
const jsonwebtoken = require("jsonwebtoken");

const indexRoute = require('./routes/index.route');
const authRoute = require('./routes/auth.route');
const chatRoute = require('./routes/chat.route');

const mongoose = require('mongoose');


const app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/layout' });

hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/lips_dev');

app.use(function(req, res, next) {
    const isInHeaders = req.headers && req.headers.authorization;
    const isInCookies = req.cookies && req.cookies.authorization;
    if (isInHeaders || isInCookies) {
      jsonwebtoken.verify(isInHeaders ? req.headers.authorization : req.cookies.authorization, 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
  });

app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/chat', chatRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
