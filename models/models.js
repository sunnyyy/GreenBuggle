var mongoose = require('mongoose');
mongoose.createConnection('mongodb://heroku_app33430818:opd13h4g80ugutu7r6hp436b4c@ds031711.mongolab.com:31711/heroku_app33430818');

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  mongoose.connect('mongodb://heroku_app33430818:opd13h4g80ugutu7r6hp436b4c@ds031711.mongolab.com:31711/heroku_app33430818');
});


// Define a schema: this gives us a structure for our data
var tripSchema = mongoose.Schema({
  personID: String,
  origin: String,
  destination: String,
  method: String,
  carbon: Number,
  date: { type: Date, default: Date.now }
});

var userSchema = mongoose.Schema({
	facebook_id: String,
  name         : String
});

// For more complex logic, methods go here
// e.g. photoSchema.methods.methodName = function()...
// or photoSchema.statics.methodName = function()...

// We compile the schema into a model, which is actually a class we can do things on.
var Trip = mongoose.model('Trip', tripSchema);
var User = mongoose.model('User', userSchema);


// Validators for our model. When we save or modify our model, these validators
// get run. If they return false, an error happens.

exports.Trip = Trip;
exports.User = User;
