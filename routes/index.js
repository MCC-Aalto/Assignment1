var express = require('express');
var router = express.Router();

// *** MongoDB connection
var mongo = require('mongodb');

/* Set User for calendar */
var user = "";

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

/* Hello World Test Page */
router.get('/helloworld', function(req, res) {
	res.render('helloworld', {title: 'Hello, World'});
});

/* GET users of DB */
router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('users');
  
	collection.find({},{},function(e,docs) {
		res.render('userlist', {
			"userlist" : docs
		});
	});
});

/* GET user and his events */
router.get('/userlist/:user', function(req, res) {
	var db = req.db;
	var collection = db.get('events');
	var username = req.params.user;
	
	// in events there is no username yet !!!
	collection.findOne({"username" : username}, function(err, e) {
		req.send("Error: No Usernames in events now");
	});
});

// *** list all events
router.get('/calendar', function(req, res) {
	var db = req.db;
	var collection = db.get('events');
	
	collection.find({},{},function(req,res) {
		res.render('calendar', {
			"user" : user,
			"events" : docs
		});
	});
});

// *** editform for a given event
router.get('/calendar/:eventId', function(req, res) {	
	var db = req.db;
	var collection = db.get('events');
	var eID = req.params.eventId;	

	console.log(mongo);
	collection.findOne({"_id" : eID}, function(err, e) {
		if (err) {
			res.redirect("calendar");
		} else {
			res.render('event', {
				"event" : e
			});
		}
	});
});

// *** Update an event
router.post('/calendar/:eventId', function(req, res) {
	req.send("Not implemented yet.");
});

// *** input for new event
router.get('/newevent', function(req, res) {
	res.render('newevent', { title: 'New Event'});
});

// *** add new event to DB
router.post('/calendar/new', function(req, res) {
	// *** database connection
	var db = req.db;
	var collection = db.get("events");
	// *** form variables
	var username = req.body.username;
	var title = req.body.title;
	var description = req.body.description;
	var start = req.body.startDate;
	var end = req.body.endDate;
	// *** insert
	collection.insert({
		"title" : title,
		"description" : description,
		"start" : new Date(start),
		"end" : new Date(end),
		"user" : username
	}, function(err, doc) {
		// *** query success or failure
		if (err) {
			res.send("Error: No event was added to database.");
		} else {
			res.redirect("calendar");
		}
	});
});

module.exports = router;