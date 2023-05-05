var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const session = require('express-session');

const MongoStore = require('connect-mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var accountRouter = require('./routes/account')
var walletRouter = require('./routes/wallet')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('trust proxy', 1);
 
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 6000000
      }, // ADDED code below !!!
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
 
        // ttl => time to live
        // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );

  app.use((req, res, next) => {
    if (req.session.user === undefined) {
      app.set('view options', { layout: 'loggedout-layout' });
    } else {
      app.set('view options', { layout: 'loggedin-layout' });
    }
  
    next();
  });

  
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter)
app.use('/account', accountRouter)
app.use('/wallet', walletRouter)

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


mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });  
  

module.exports = app;
