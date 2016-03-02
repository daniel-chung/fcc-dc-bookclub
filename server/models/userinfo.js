// app/models/user.js
'use strict';

// Load packages ---------------------------------------------------------------
var mongoose = require('mongoose');


// Define User model schema ----------------------------------------------------
var userinfoSchema = mongoose.Schema({
    username  : String,
    firstname : String,
    lastname  : String,
    city 	  : String,
    state 	  : String
});


// Plugin and Export -----------------------------------------------------------
module.exports = mongoose.model('Userinfo', userinfoSchema);


// EOF -------------------------------------------------------------------------
