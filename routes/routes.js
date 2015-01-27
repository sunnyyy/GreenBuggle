var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');


// Import our models file to the router
var models = require('../models/models');
console.log(models);
// Connect to the database over Mongoose
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://heroku_app33430818:opd13h4g80ugutu7r6hp436b4c@ds031711.mongolab.com:31711/heroku_app33430818');

/* GET / -- homepage */
router.get('/', function(req, res) {
  res.render('homepage', {});
});

/* GET /choices */
//for now: it's just one person and unpersonalized..
router.get('/choices', isLoggedIn, function(req, res) {
  console.log(req.user);
  res.render('choices', { user: req.user });
});

/* GET /tripPlanner */
//allows the user to add a trip into their history after searching
router.get('/tripPlanner', isLoggedIn, function(req, res) {
  res.render('tripPlanner', {user: req.user});
});

/* GET /FAQ*/
router.get('/faqs', function(req, res) {
  res.render('faqs', {});
});


/* GET /badges */
router.get('/badges', isLoggedIn, function(req, res) {
  var currentUser = req.user.facebook_id;
  models.Trip.find({personID: currentUser, $or: [
       {method: "transit"}, {method:"walking"}
      ]}, function(err, results) {
      if( err ) return handleError(err);
      var arrayToSendBack = []; // this might be populated with something else
      results.forEach(function(result) {
        arrayToSendBack.push(result);
      });
    res.render('badges', {db: arrayToSendBack, user: req.user});
  });
});


/* GET /past trips displays the past trips of the user*/
router.get('/pastTrips', isLoggedIn, function(req, res) {
  console.log("entered the past trips page");
  var currentUser = req.user.facebook_id;
  models.Trip.find({personID: currentUser }, 'origin destination carbon method date', function (err, results){
    console.log("entered the find phase");
    if( err ) return handleError(err);
    console.log(results);
    res.render('pastTrips', {db: results, user: req.user});
  });
});


/* POST /pastTrips */
router.post('/pastTrips', isLoggedIn, function(req, res) {
  // 1. read the submitted things
  console.log(req.body['transportation']);
  if (req.body['transportation']!="no"){
    console.log(req.body['start']);
  var newTrip = new models.Trip({
    origin: req.body['start'],
    destination: req.body['end'],
    method: req.body['transportation'],
    carbon: req.body['carbonValue'],
    personID: req.user.facebook_id
  });
  // 2. store it.
    newTrip.save(function(err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(newTrip);
        console.log("printed newTrip")
        res.redirect('/pastTrips');        
      }

  });
    } else {
      res.redirect('/choices');
    }
});


/*FB LOGIN FANCY SCHMANCY*/
// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   homepage to login.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the choices page.
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    console.log("successfully authenitcate");
    res.redirect('/choices');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


/*error handling chunk of code*/

router.get('/404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

router.get('/403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

router.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});

router.use(function(req, res, next){
  res.status(404);
  res.render('404', {});
});

/*error handling chunk of code end*/



// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   homepage to login.
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    res.redirect('/');
}


module.exports = router;
