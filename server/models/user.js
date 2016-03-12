// /server/models/user.js
'use strict';

// Load packages ---------------------------------------------------------------
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
//var plm      = require('passport-local-mongoose');


// Define User model schema ----------------------------------------------------
var userSchema = mongoose.Schema({
    username  : String,
    password  : String,
});



// Methods ---------------------------------------------------------------------
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


// Plugin and Export -----------------------------------------------------------
module.exports = mongoose.model('User', userSchema);


// EOF -------------------------------------------------------------------------
