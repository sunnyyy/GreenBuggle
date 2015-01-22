var express = require('express');
var router = express.Router();

// Import our models file to the router
var models = require('../models/models');
console.log(models);
// Connect to the database over Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/greenBuggle');

/* GET / -- homepage */
router.get('/', function(req, res) {
  res.render('homepage', {});
});

/* GET /choices */
//for now: it's just one person and unpersonalized..
router.get('/choices', function(req, res) {
  res.render('choices', {});
});

/* GET /tripPlanner */
//allows the user to add a trip into their history after searching
router.get('/tripPlanner', function(req, res) {
  res.render('tripPlanner', {});
});

/* GET /badges */
router.get('/badges', function(req, res) {
  res.render('badges', {});
});


/* GET /past trips displays ONE past history ok*/
router.get('/pastTrips', function(req, res) {
  console.log("entered the past trips page");
  models.Trip.find({}, 'origin destination carbon method date', function (err, results){
    console.log("entered the find phase");
    if( err ) return handleError(err);
    console.log(results);
    res.render('pastTrips', {db: results});
  });
});


/* POST /pastTrips */
router.post('/pastTrips', function(req, res) {
  // 1. read the submitted things
  if (req.body['transportation']!="no"){
  var newTrip = new models.Trip({
    origin: req.body['start'],
    destination: req.body['end'],
    method: req.body['transportation'],
    carbon: req.body['carbonValue']
  });
  // 2. store it.
    newTrip.save(function(err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(newTrip);
        console.log("printed newTrip")
        // res.redirect('/pastTrips/';
        res.redirect('/pastTrips');        
      }

  });
    } else {
      res.redirect('/choices');
    }
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


module.exports = router;
