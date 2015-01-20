var express = require('express');
var router = express.Router();

// Import our models file to the router
var models = require('../models/models');
console.log(models);
// Connect to the database over Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/photos-demo');

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

/*GET /pasttrips displays all the past history yay*/
// router.get('/pastTrips', function(req, res) {
//   models.Trip.find, function(error, results) {
//   var arrayToSendBack = [] // this might be populated with something else
//   results.forEach(function(result) {
//     arrayToSendBack.push(result);
//   });
// })
//   res.render('pastTrips', {});
// });

/* GET /past trips displays ONE past history ok*/
router.get('/pastTrips', function(req, res) {
  models.Trip.findOne({method: 'drive'}, function (err, result) {
    console.log(result);
    res.render('pastTrips', {trip: result});
  });
});

/* POST /pastTrips */
router.post('/pastTrips', function(req, res) {
  // 1. read the submitted things
  console.log(req.body);
  if (req.body['transportation']!="no"){
  var newTrip = new models.Trip({
    origin: req.body['start'],
    destination: req.body['end'],
    method: req.body['transportation'],
    carbon: req.body['carbonValue']
  });
  // 2. store it.
    
      newTrip.save(function(err, result) {
      console.log(result);
      // res.redirect('/pastTrips/';
      res.redirect('/pastTrips');
    
  });
    } else {
      res.redirect('/choices');
    }
});

module.exports = router;
