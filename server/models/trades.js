// app/models/trades.js
'use strict';

// Load packages ---------------------------------------------------------------
var mongoose = require('mongoose');


// Define Books model schema ---------------------------------------------------
var tradesSchema = mongoose.Schema({
  bookid    : mongoose.Schema.ObjectId,
  bookname  : String,
  requester : String,
  owner 		: String,
  offerid 	: String,
  offername	: String
});


// Export ----------------------------------------------------------------------
module.exports = mongoose.model('Trades', tradesSchema);


// EOF -------------------------------------------------------------------------
