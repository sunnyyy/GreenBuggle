var express = require('express');
var router = express.Router();

var history = {
  1: {
    origin:'Wellesley',
    destination: 'Boston',
    method: 'transit',
    carbon: 24
  }
};

var counter = 2;

/* GET / -- homepage */
router.get('/', function(req, res) {
  res.render('homepage', {});
});

/* GET /users */
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

/* GET /badges */
router.get('/records/:id', function(req, res) {
  var recordsId = req.param('id');
  res.render('trip', { trip: records[recordsId] });
});

/* GET /photos/123 */
router.get('/photos/:id', function(req, res) {
  var photoId = req.param('id');
  res.render('photo', { photo: fakedb[photoId] });
});

/* POST /photos */
router.post('/records', function(req, res) {
  // 1. read the submitted url
  var origin = req.body['submit-origin'],
  var destination = req.body['submit-destination'],
  var method = 'car',
  var carbon = 123
  // 2. store it.
  history[counter] = {
    origin: origin,
    caption: caption,
    method: method,
    carbon: carbon
  };
  res.redirect('/records/' + (counter++));
});

module.exports = router;
