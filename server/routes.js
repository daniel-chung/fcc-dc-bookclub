// /server/routes.js
'use strict';

// Load packages ---------------------------------------------------------------
var request 	= require('request');

var Books 		= require('./models/books');
var Trades 		= require('./models/trades');
var User 			= require('./models/user');
var Userinfo 	= require('./models/userinfo');


module.exports = function(app, passport) {

	// User routes ---------------------------------------------------------------
	app.route('/user/register')
		.post(
			passport.authenticate('local-signup', 
			{
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
  }));

	app.route('/user/login')
		.post(
			passport.authenticate('local-login'), function(req, res) {
				res.send(req.user);
			});

/*			, {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
  }));
*/

	app.route('/user/logout')
		.get(function(req, res) {
			req.logout();
			res.status(200).json({status: 'Bye!'})
	});

	app.route('/user/changepassword')
		.post(
			passport.authenticate('local-changepassword'), 
			function(req, res) {
				console.log('change success', req.user);
				res.end();
	});


	// Setting routes ------------------------------------------------------------
	app.route('/setting/password')
		.post(function(req, res) {
			res.end();
	});

	app.route('/setting/username')
		.get(function(req, res) {
			return res.json({
				username: req.user.username
			});
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
			console.log('getinto', req);
			console.log('getinto session', req.session);
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
			console.log('books/user', req.user);
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


// Todo: synchronous calls seem to be broken
	app.route('/books/add')
    .post(function(req, res) {

      var apiUrl = 'https://www.googleapis.com/books/v1/volumes?' +
        'key=' + process.env.GOOGLE_BOOKS_API_KEY + 
        '&maxResults=1' +
        '&q=';

      function queryBooksAPI(bookName) {
      	var queryBookName = bookName.replace(/\s+/g, "+");

	      console.log('API url', apiUrl);
	      console.log('book name', req.body.bookName);

				request(apiUrl+queryBookName, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				  	var bookResult = JSON.parse(body);
				    var thumbnail = bookResult.items[0].volumeInfo.imageLinks.thumbnail;

						var newBook = new Books();
						newBook.bookname = req.body.bookName;
						newBook.username = req.user.username;
						newBook.thumbnail = thumbnail;
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
					else
						res.json({ message: "Something went wrong!" });
      	});
      };


			Books.findOne (
				{ username: req.user.username, bookname: req.body.bookName },
				function (err, book) {
					if (err)
						throw err;
					else if (book)
						res.json({ message: "Book already exists!" });
					else {
						queryBooksAPI(req.body.bookName);
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
          	res.json({
          		username: req.user.username,
          		books: books
          	});
          else
          	res.end();
			});
	});



	// Trade routes --------------------------------------------------------------
	app.route('/trade/id/:bookid')
		.get(function(req, res) {		//get for testing
			Trades.findOne({ 'bookid': req.params.bookid },
				function(err, trade) {
					if (err)
						throw err;
					else if (trade && trade.status === -1) {
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
									newTrade.thumbnail = bookinfo.thumbnail;
									newTrade.status = -1;
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
			Trades.find({ 'requester': req.user.username, 'status': -1 },
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
			Trades.find({ 'owner': req.user.username, 'status': -1 },
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

	app.route('/trade/accept')
    .post(function(req, res) {
    	console.log('post trade/accept', req.body._id);
			Trades.findOneAndUpdate(
				{ _id: req.body._id }, 
				{ status: 1 },
				{ upsert: false},
				function(err, doc){
			    if (err) 
			    	return res.send(500, { error: err });
			    return res.end();
			});
	});

	app.route('/trade/decline')
    .post(function(req, res) {
    	console.log('post trade/decline', req.body._id);
			Trades.findOneAndUpdate(
				{ _id: req.body._id }, 
				{ status: 0 },
				{ upsert: false},
				function(err, doc){
			    if (err) 
			    	return res.send(500, { error: err });
			    return res.end();
			});
	});


  app.route('/trade/borrowed')
  	.get(function(req, res) {
			Trades.find({ 'requester': req.user.username, 'status': 1 },
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



  app.route('/trade/return')
  	.post(function(req, res) {

			Trades.findOneAndUpdate(
				{ _id: req.body._id }, 
				{ status: 2 },
				{ upsert: false},
				function(err, doc){
			    if (err) 
			    	return res.send(500, { error: err });
			    return res.end();
			});
  });

};


// EOF -------------------------------------------------------------------------
