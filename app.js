var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config');
var routes = require('./server/routes/index');
var login = require('./server/routes/login');
var passport = require('passport');
var passportJwt = require('passport-jwt');

var app = express();

mongoose.connect(config.database);
mongoose.set('debug', true);

app.use(express.static(path.join(__dirname, 'client')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(passport.initialize());
require('./config/passport')(passport);
app.use('/', routes);
app.use('/api/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
