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
mongoose.connect('mongodb://heroku_app33430818:opd13h4g80ugutu7r6hp436b4c@ds031711.mongolab.com:31711/heroku_app33430818');

var models = require('./models/models');
console.log(models);


var FACEBOOK_APP_ID = "785704354835227";
var FACEBOOK_APP_SECRET = "7118531d3c79e20622f75e7272b75406";



/* Initialize the Express application */
var app = express();

//intialize passport stuff
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: false}));
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
app.use(cookieParser('keyboard cat'));
app.use(express.static(path.join(__dirname, 'public')));
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



 passport.use(new FacebookStrategy({

        clientID        : FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "https://greenbuggle.herokuapp.com/auth/facebook/callback"

    },
        function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
                models.User.findOne({ 'facebook_id' : profile.id }, function(err, user) {
                    //req.session.userid = profile.id;  

                    if (err)
                        return done(err);

                    if (user) {
                        console.log(profile.id);
                        console.log("saving a id session to be as");
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebook_id) {
                            console.log("saving new person");
                            name  = profile.name.givenName;
                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = new models.User();

                        newUser.facebook_id    = profile.id;
                        newUser.name  = profile.name.givenName;
                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newUser);
                        });
                    }
                });

        });

    }));



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
