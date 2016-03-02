// app/models/user.js
'use strict';

// Load packages ---------------------------------------------------------------
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var plm      = require('passport-local-mongoose');


// Define User model schema ----------------------------------------------------
var userSchema = mongoose.Schema({
    username  : String,
    password  : String
});


// Plugin and Export -----------------------------------------------------------
userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);


// EOF -------------------------------------------------------------------------
