/* Load Express libraries */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var util = require('util');
var FacebookStrategy = require('passport-facebook');
var session = require('express-session');
// require('./config/passport')(passport); // pass passport for configuration

console.log("creating the connection of doom"); // load up the user model var
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demo');

var models = require('./models/models');
console.log(models);


var FACEBOOK_APP_ID = "785704354835227";
var FACEBOOK_APP_SECRET = "7118531d3c79e20622f75e7272b75406";



/* Initialize the Express application */
var app = express();

//intialize passport stuff
app.use(passport.initialize());
app.use(passport.session());

/* More Express magic */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat' }));
app.use(methodOverride());



/* Tell app to use routes file */
var routes = require('./routes/routes');
app.use('/', routes);
// require('./routes/routes.js')(app, passport); 

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('Now Check User');
    models.User.findOne({
        facebook_id: profile.id
    }, function(err, doc) {
        if (err) {
            console.log('user is alredy registered!');
            return done(err);
        }
        if (!insertUser) {
            var newUser = new models.User({
                personName: profile.first_name,
                facebook_id: profile.id
            });
            newUser.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Saved');
                }
                return done(err, doc);
            });
        } else {
            //found user. Return
            console.log('user is alredy registered!');
            return done(err, doc);
        }
    });
}
));

console.log("setup the fb stuff successfully!");

/* Error handling below here -- leave as is */
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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
};

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
