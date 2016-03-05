// /server/config/passport.js
'use strict';

// Load packages ---------------------------------------------------------------
var LocalStrategy = require('passport-local').Strategy;


// load models -----------------------------------------------------------------
var User = require('../models/user');


// Expose to our app -----------------------------------------------------------
module.exports = function(app, passport) {

	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

	//config Passport
	passport.use(new LocalStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());

};


// EOF -------------------------------------------------------------------------
