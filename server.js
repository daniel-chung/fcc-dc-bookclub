// /server.js
'use strict';

// Load packages ---------------------------------------------------------------
var express         = require('express');
var session         = require('express-session');
var cookieParser    = require('cookie-parser');
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var passport        = require('passport');

require('dotenv').load();     // allows us to use .env for security


// Setup Node.js and Express.js ------------------------------------------------
var app = express();
var port = process.env.PORT || 8080;


// Setup Mongoose --------------------------------------------------------------
mongoose.connect((process.env.MONGOLAB_URI || process.env.MONGO_URI) + "/book");


// Other configurations
app.use(morgan('dev'));                                            // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));              // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                       // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));   // parse application/vnd.api+json as json
app.use(methodOverride());                                        // override with the X-HTTTP-Method-Override header in the request. simulate DELTE/PUT on forms

app.use(cookieParser());                                          // set up session
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	httpOnly: false,
}));


// Passport setup --------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./server/config/passport')(passport);


// Routing links ---------------------------------------------------------------
// set the static files location; /public/img will be /img for users
app.use(express.static(__dirname + '/public'));


// Setup Express routes --------------------------------------------------------
require('./server/routes.js')(app, passport);



// Start server ----------------------------------------------------------------
app.listen(port, function() {
	console.log('Node.js listening on port ' + port);
});


// EOF -------------------------------------------------------------------------
