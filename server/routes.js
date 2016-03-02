// /app/routes.js
'use strict';

// Load packages ---------------------------------------------------------------
var Books = require('./models/books');
var Trades = require('./models/trades');
var User = require('./models/user');
var Userinfo = require('./models/userinfo');


module.exports = function(app, passport) {

	// User routes ---------------------------------------------------------------
	app.route('/user/register')
		.post(function(req, res) {
			User.register(
		    new User({ username: req.body.username }),
		    req.body.password,
		    function(err, account) {
					if (err)
						return res.status(500).json({err: err});
					passport.authenticate('local')(req, res, function () {
						return res.status(200).json({status: 'Registration successful!'})
					});
		    });
	});

	app.route('/user/login')
		.post(function(req, res, next) {
			passport.authenticate('local', function(err, user, info) {
				if (err) { return next(err) }
				if (!user)
					return res.status(401).json({err: info});
				req.logIn(user, function(err) {
					if (err)
						return res.status(500).json({err: 'Could not log in user'});
					res.status(200).json({status: 'Login successful!'})
				});
			})(req, res, next);
	});

	app.route('/user/logout')
		.get(function(req, res) {
			req.logout();
			res.status(200).json({status: 'Bye!'})
		});


	// Setting routes ------------------------------------------------------------
	app.route('/setting/password')
		.post(function(req, res) {
			res.end();
	});

	app.route('/setting/fullname')
		.post(function(req, res) {
			//TODO: check for authentication
			Userinfo.findOne({ 'username': req.user.username }, 
				function(err, userinfo) {
					if (err)
						throw err;
					else if (userinfo) {
						console.log('found user', userinfo);
						userinfo.firstname = req.body.firstname; 	// get info from request
						userinfo.lastname = req.body.lastname;		// get info from request
						userinfo.save(function(err) {
							if (err)
								throw err;
							return res.end();
						});
					}
					else {
						console.log('creating new user');
	          var newUserinfo = new Userinfo();
						newUserinfo.username = req.user.username;
	          newUserinfo.firstname = req.body.firstname; // get info from request
	          newUserinfo.lastname = req.body.lastname;   // get info from request
	          newUserinfo.save(function(err) {
	            if (err)
	              throw err;
							return res.end();
	          });						
					}
			});
	});

	app.route('/setting/location')
		.post(function(req, res) {
			//TODO: check for authentication
			Userinfo.findOne({ 'username': req.user.username }, 
				function(err, userinfo) {
					if (err)
						throw err;
					else if (userinfo) {
						console.log('found user', userinfo);
						userinfo.city = req.body.city; 	// get info from request
						userinfo.state = req.body.state;		// get info from request
						userinfo.save(function(err) {
							if (err)
								throw err;
							return res.end();
						});
					}
					else {
						console.log('creating new user');
	          var newUserinfo = new Userinfo();
						newUserinfo.username = req.user.username;
	          newUserinfo.city = req.body.city; // get info from request
	          newUserinfo.state = req.body.state;   // get info from request
	          newUserinfo.save(function(err) {
	            if (err)
	              throw err;
							return res.end();
	          });						
					}
			});	
		});

	app.route('/setting/getinfo')
		.get(function(req, res) {
			Userinfo.findOne({ 'username': req.user.username }, 
				function(err, userinfo) {
					if (err)
						throw err;
					else if (userinfo) {
						console.log("routes userinfo", userinfo);
						res.json(userinfo);
					}
					else {
						return res.json({});
					}
			});
		});


	// Books routes --------------------------------------------------------------
	app.route('/books/user')
    .get(function(req, res) {
			console.log(req.user);
			Books.find (
				{ username: req.user.username },
				function (err, books) {
					if (err)
						throw err;
					else if (books)
						res.json(books);
					else
						res.end();
			});
   });

	app.route('/books/add')
    .post(function(req, res) {
			Books.findOne (
				{ username: req.user.username, bookname: req.body.bookName },
				function (err, book) {
					if (err)
						throw err;
					else if (book)
						res.json({ message: "Book already exists!" });
					else {
						var newBook = new Books();
						newBook.bookname = req.body.bookName;
						newBook.username = req.user.username;
						newBook.save(function(err) {
							if (err) 
								throw err;
							Books.find({username: req.user.username}, function(err, book) {
								if (book)
									res.json({ message: "Book succesfully added", data: book });
								else {
									// handle error
								}
							});
						});
					}
			});
	});


	app.route('/books/remove')
    .post(function(req, res) {
			Books.remove (
				{ _id: req.body._id },
				function (err, book) {
					if (err)
						throw err;
					res.end();
			});
	});

	app.route('/books/all')
    .get(function(req, res) {
			Books.find (
				{ },
				function (err, books) {
					if (err)
						throw err;
          else if (books)
          	res.json(books);
          else
          	res.end();
			});
	});

// Trade routes ----------------------------------------------------------------
app.route('/trade/id/:bookid')
	.get(function(req, res) {		//get for testing
		//console.log('in trade route', req.params.bookid);
		Trades.findOne({ 'bookid': req.params.bookid },
			function(err, trade) {

				// TODO: Check to makes sure the book isn't one's own

				if (err)
					throw err;
				else if (trade) {
					console.log('Trade already exists!');
					return res.end();
				}
				else {
					var bookId = req.params.bookid;
					// Find the book information
					Books.findOne({ '_id': bookId },
						function (err, bookinfo) {
							if (err)
								throw err;
							else if (bookinfo) {
								var newTrade = new Trades();
								newTrade.bookid = bookId;
								newTrade.requester = req.user.username;
								newTrade.owner = bookinfo.username;
								newTrade.bookname = bookinfo.bookname;
								newTrade.save(function(err) {
									if (err)
										throw err;
									return res.end();
								})
							}
							else {
								console.log("something went wrong, there should be a book");
								return res.end();
							}
					});
				}
		});
	});

app.route('/trade/requested')
	.get(function(req, res) {
		Trades.find({ 'requester': req.user.username },
			function(err, trade) {

				if (err)
					throw err;
				else if (trade) {
					return res.json(trade);
				}
				else {
					return res.json({});
				}
		});
	});

app.route('/trade/received')
	.get(function(req, res) {
		Trades.find({ 'owner': req.user.username },
			function(err, trade) {
				if (err)
					throw err;
				else if (trade) {
					return res.json(trade);
				}
				else {
					return res.json({});
				}
		});
	});

	app.route('/trade/withdraw')
    .post(function(req, res) {
			Trades.remove (
				{ _id: req.body._id },
				function (err, trades) {
					if (err)
						throw err;
        	res.end();
			});
	});

};


// EOF -------------------------------------------------------------------------
