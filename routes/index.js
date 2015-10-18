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
router.get('/userlist/:userid', function(req, res) {
	var db = req.db;
	var collection = db.get('events');
	var user = mongo.ObjectID(req.params.userid);
	
	// in events there is no username yet !!!
	collection.find({"user" : user}, function(err, docs) {
		if(err) {
			res.send("Error: No Usernames in events now");
		} else {
			res.render('user', {
				"events" : docs
			});
		}
	});
});

// *** list all events
router.get('/calendar', function(req, res) {
	var db = req.db;
	var collection = db.get('events');
	
	collection.find({},{},function(err, docs) {
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
router.post('/calendar', function(req, res) {
	// *** database connection
	var db = req.db;
	var collection = db.get("events");
	var usercollection = db.get("users");
	// *** form variables
	var user = usercollection.findOne({"username" : req.body.username})._id;
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
		"user" : mongo.ObjectID(user)
	}, function(err, doc) {
		// *** query success or failure
		if (err) {
			res.send("Error: No event was added to database.");
		} else {
			res.redirect("calendar");
		}
	});
});

// *** editform for a given event
router.get('/calendar/:eventId', function(req, res) {	
	var db = req.db;
	var collection = db.get('events');
	var eID = mongo.ObjectID(req.params.eventId);	

	collection.findOne({"_id" : eID}, function(err, e) {
		if (err) {
			res.redirect("calendar");
		} else {
			res.render('event', {
				"name" : e.title,
				"event" : e
			});
		}
	});
});

// Delete calendar entry
router.delete('/calendar/:eventId', function(req, res, next) {
	var db = req.db;
	var collection = db.get('events');
	var eID = mongo.ObjectID(req.params.eventId);
	
	console.log("hierher komm ich noch");
	
	collection.remove({"_id" : eID}, function(err, post) {
		console.log("jaja");
		if (err) return next(err);
		res.redirect("calendar");
	});
});

// *** Update an event
router.put('/calendar/:eventId', function(req, res) {
	var db = req.db;
	var collection = db.get('events');
	var usercollection = db.get('users');
	var eID = mongo.ObjectID(req.params.eventId);
	
	var user = usercollection.findOne({"username" : req.body.username})._id;
	var title = req.body.title;
	var description = req.body.description;
	var start = req.body.startDate;
	var end = req.body.endDate;	
	
	collection.findAndModify({
		query: {_id: eID},
		update: {$set:
			{
				title: title,
				description: description,
				start: new Date(start),
				end: new Date(end),
				user: mongo.ObjectID(user)
			}
		}
	});
});

module.exports = router;