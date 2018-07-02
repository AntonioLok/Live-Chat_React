const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const cookie = require('cookie');
const User = require('../models/user');
const mongoose = require('mongoose');

	
mongoose.connect('mongodb://user123:user123@ds123981.mlab.com:23981/live-chat');
const dbconnection = mongoose.connection;

//handle mongo error
dbconnection.on('error', console.error.bind(console, 'connection error:'));
dbconnection.once('open', function () {
	console.log("We are connected");
  // we're connected!
});


router.put('/sign-up', (req, res, next) => {
	var user = new User({
		username: req.body.username.toLowerCase(),
    });
	user.password = user.generateHash(req.body.password);
          // Save user to database
        user.save((err) => {
        // Check if error occured
		if (err) {
		  // Check if error is an error indicating duplicate account
		  if (err.code === 11000) {
			res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
		  }
		}else {
		  res.json({ success: true, message: 'Acount registered!' }); // Return success 
		  }
	});
});

router.put('/log-in', (req, res, next) => {
	User.authenticate(req.body.username, req.body.password, function (error, user) {
		if (!user || error) {
			res.json({ success: false, message: error.message });
		} else { 
		req.session.username = user._id;
			res.setHeader('Set-Cookie', cookie.serialize('username', user._id, {
              path : '/', 
              maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
			}));
			res.json({ success: true, message: 'Logged in'});
		}
	});	
});

router.get('/log-out', (req, res, next) => {
	if (req.session.username) { 
		req.session.destroy();
		res.setHeader('Set-Cookie', cookie.serialize('username', '', {
			  path : '/', 
			  maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
		}));
		res.json({ success: true, message: 'Logged out' });
	} else {
		res.json({ success: false, message: 'Not user logged in' });
	}
});

router.get('/user/:id/cart', (req, res, next) => {
	 User.getCart(req.params.id, function(err, cart) {
		if (err) {
			res.json({ success: false, message: "error", userCart : []});
		} else  {
			res.json({ success: true, message: "success", userCart : cart});
		}
	});
});

router.patch('/update-cart', (req, res, next) => {
	if (!req.session.username) {
		res.json({ success: false, message: "No permission"});
	} else {
		User.updateCart(req.session.username, req.body, function(user){
			res.json({ success: true, message: "Updated successfuly"});
		});
	}
});

module.exports = router;