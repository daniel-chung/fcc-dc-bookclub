// app/models/books.js
'use strict';

// Load packages ---------------------------------------------------------------
var mongoose = require('mongoose');


// Define Books model schema ---------------------------------------------------
var booksSchema = mongoose.Schema({
  username  : String,
  bookname  : String,
  thumbnail	: String
});


// Export ----------------------------------------------------------------------
module.exports = mongoose.model('Books', booksSchema);


// EOF -------------------------------------------------------------------------
