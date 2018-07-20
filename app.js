const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const uuid = require('uuid/v4');
const favicon = require('serve-favicon');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const validator = require('express-validator');
const flash = require('connect-flash');

// Routes:
const dashboardRouter = require('./routes/dashboard');
const loginRouter = require('./routes/login');
const logOutRouter = require('./routes/logout');
const checkInRouter = require('./routes/checkin');
const checkOutRouter = require('./routes/checkout');
const registerRouter = require('./routes/register');

const NUMBERS = "0123456789";
const ALPHA = "abcdefghijklmnopqrstuvwx";

const app = express();

// session set up
app.use(session({
  genid: (req) => {
    return uuid();
  },
  secret: 'k1d5z0n3',
  cookie: {
    maxAge: 180000
  },
  saveUninitialized: false,
  resave: false
}));

app.use(validator({
  customValidators: {
    isNotSequence(val) {
      const lowerText = val.toLowerCase();
      return lowerText.includes(NUMBERS) || lowerText.includes(ALPHA);
    },
    matchesPassword(pass, conf){
      return pass.toLowerCase() == conf.toLowerCase();
    }
  }
}));

app.use(flash());

app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// models:
const User = require('./models/User');
const Minder = require('./models/Minder');
const ParentGuardian = require('./models/ParentGuardian');
const Role = require('./models/Role');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(config.get('dbUrl'));

const setUpDb = async () => {
  const dbUrl = config.get('dbUrl');

  mongoose.Promise = Promise;
  mongoose.connect(dbUrl);

  if (process.env.NODE_ENV === 'development'){
    try {
      try {
        await User.collection.drop();
        await console.log(`==> Dropped Users Collection!!!!`);
      }
      catch (e){
        if (e.code !== 26){
          // known issue where a non existing collection is dropped
          throw e;
        }
      }
    }
    catch (e){
      throw (e);
    }
  }
};

setUpDb();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.appName = 'Kids Zone';

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascripts', express.static(__dirname + "/node_modules/popper.js/dist/"))
app.use('/javascripts', express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use('/javascripts', express.static(__dirname + "/node_modules/jquery/dist"));
app.use('/stylesheets', express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use('/stylesheets', express.static(__dirname + "/node_modules/font-awesome/css"));
app.use('/fonts', express.static(__dirname + "/node_modules/font-awesome/fonts"));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))


app.use('/login', loginRouter);
app.use('/logout', logOutRouter);
app.use('/checkin', checkInRouter);
app.use('/checkout', checkOutRouter);
app.use('/register', registerRouter);

app.use((req, res, next) => {  
  const route = req.flash('route')[0] || '';  

  console.log(`==> Checking if user logged in ... [${req.url}] [${req.session.user}] [${route}]`);

  if (req.user === undefined){
    console.log(`==> Redirecting user to log in screen`);
    res.redirect('/login');
  }
  else {
    if (route === 'register'){
      console.log(`==> Redirecting user to log in screen`);
      res.redirect('/login');
    }
    else {
      req.session.user = req.user;
      console.log(`==> User exists!`);
      next();
    }
  }
});

app.use('/', dashboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = 8090;

app.listen(port,() => console.log(`==> App Started on port ${port}`));

module.exports = app;
