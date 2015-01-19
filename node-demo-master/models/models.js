var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// Define a schema: this gives us a structure for our data
var tripSchema = mongoose.Schema({
  origin: String,
  destination: String,
  method: String,
  carbon: Number,
});

// For more complex logic, methods go here
// e.g. photoSchema.methods.methodName = function()...
// or photoSchema.statics.methodName = function()...

// We compile the schema into a model, which is actually a class we can do things on.
var Trip = mongoose.model('Trip', tripSchema);

var checkLength = function(s) {
  return s.length > 0;
};

// Validators for our model. When we save or modify our model, these validators
// get run. If they return false, an error happens.

exports.Trip = Trip;
