// /server/config/passport.js
'use strict';

// Load packages ---------------------------------------------------------------
var LocalStrategy = require('passport-local').Strategy;


// load models -----------------------------------------------------------------
var User      		= require('../models/user');


// Expose to our app -----------------------------------------------------------
module.exports = function(passport) {

  // PASSPORT SESSION SETUP ----------------------------------------------------
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
	    if (err) { 
	    	return done(err); 
	   	}
    	done(err, user);
    });
  });


  // LOCAL SIGNUP --------------------------------------------------------------
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, username, password, done) {
    process.nextTick(function() {
      User.findOne({ 'username' :  username }, function(err, user) {
        if (err)
          return done(err);
        else if (user) {
          return done(null, false, req.flash('signupMessage', 
            'That email is already taken.'));
        } 
        else {
          var newUser = new User();
          newUser.username = username;
          newUser.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));


  // LOCAL LOGIN ---------------------------------------------------------------
  passport.use('local-login', new LocalStrategy({
	    usernameField : 'username',
	    passwordField : 'password',
	    passReqToCallback : true
	  },
	  function(req, username, password, done) { 
	    User.findOne({ 'username' :  username }, function(err, user) {
	      if (err) {
	      	console.log('User.findOne err');
	        return done(err);
	      }
	      else if (!user) {
	      	console.log('user doesn\'t exist');
	        return done(null, false); 
	      }
	      else if (!user.validPassword(password)) {
	      	console.log('Wrong password', user.password, password);
	        return done(null, false);
	      }
	      else {
		      return done(null, user);
	      }
	    });
	  })
	 );


  // LOCAL CHANGE PASSWORD -----------------------------------------------------
  passport.use('local-changepassword', new LocalStrategy({
	    // by default, local strategy uses username and password, we will override with email
	    usernameField : 'username',
	    passwordField : 'password',
	    passReqToCallback : true // allows us to pass back the entire request to the callback
	  },
	  function(req, username, password, done) { 
	    User.findOne({ 'username' :  username }, function(err, user) {
	      if (err) {
	        return done(err);
	      }
	      else if (!user) {
	        return done(null, false); 
	      }
	      else if (!user.validPassword(password)) {
	        return done(null, false);
	      }

	      else {		      
          user.password = user.generateHash(req.body.newpassword);
          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
		    }
	    });
	  })
	 );





};





// EOF -------------------------------------------------------------------------
