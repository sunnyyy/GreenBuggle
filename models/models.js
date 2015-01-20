var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_app33376042:a44q25p2665td5s2pq0ojrjqrd@ds031651.m
ongolab.com:31651/heroku_app33376042');

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  mongoose.connect('mongodb://heroku_app33376042:a44q25p2665td5s2pq0ojrjqrd@ds031651.m
ongolab.com:31651/heroku_app33376042');
});


// Define a schema: this gives us a structure for our data
var tripSchema = mongoose.Schema({
  origin: String,
  destination: String,
  method: String,
  carbon: Number,
  date: { type: Date, default: Date.now }
});

// For more complex logic, methods go here
// e.g. photoSchema.methods.methodName = function()...
// or photoSchema.statics.methodName = function()...

// We compile the schema into a model, which is actually a class we can do things on.
var Trip = mongoose.model('Trip', tripSchema);


// Validators for our model. When we save or modify our model, these validators
// get run. If they return false, an error happens.

exports.Trip = Trip;
