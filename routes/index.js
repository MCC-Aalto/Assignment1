var express = require('express');
var router = express.Router();

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

// *** get all events
router.get('/calendar', function(req, res) {	
	var db = req.db;
	var collection = db.get('events');

	collection.find({},{},function(e,docs) {
		res.render('calendar', {
			"user" : user,
			"events" : docs
		});
	});
});

// *** input for new event
router.get('/newevent', function(req, res) {
	res.render('newevent', { title: 'New Event'});
});

// *** add new event to DB
router.post('/addevent', function(req, res) {
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