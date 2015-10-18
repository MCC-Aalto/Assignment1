var express = require('express');
var router = express.Router();

/* MongoDB */
var mongo = require('mongodb');

/* Set User for calendar */
var user = "";

/* Render default Express homepage */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

/* List all users of DB */
router.get('/userlist', function(req, res) {
	/* MongoDB database connections */
	var db = req.db;
	var collection = db.get('users');
  
	/* Get all users and render */
	collection.find({},{},function(e,docs) {
		res.render('userlist', {
			"userlist" : docs
		});
	});
});

/* List user's events */
router.get('/userlist/:userid', function(req, res) {
	/* MongoDB database connections */
	var db = req.db;
	var collection = db.get('events');
	
	/* Given ID of user */
	var user = mongo.ObjectID(req.params.userid);
	
	/* Find user by ID and render */
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

/* List all events */
router.get('/calendar', function(req, res) {
	/* MongoDB database connections */
	var db = req.db;
	var collection = db.get('events');
	
	/* List all events and render */
	collection.find({},{},function(err, docs) {
		res.render('calendar', {
			"user" : user,
			"events" : docs
		});
	});
});

/* Render the site for a new event */
router.get('/newevent', function(req, res) {
	res.render('newevent', { title: 'New Event'});
});

/* Insert the new event */
router.post('/calendar', function(req, res) {
	/* MongoDB database connections */
	var db = req.db;
	var collection = db.get("events");
	var usercollection = db.get("users");
	
	/* Define the variables */
	var user = usercollection.findOne({"username" : req.body.username})._id;
	var title = req.body.title;
	var description = req.body.description;
	var start = req.body.startDate;
	var end = req.body.endDate;	
	
	/* Insert the new event */
	collection.insert({
		"title" : title,
		"description" : description,
		"start" : new Date(start),
		"end" : new Date(end),
		"user" : mongo.ObjectID(user)
	}, function(err, doc) {
		if (err) {
			res.send("Error: No event was added to database.");
		} else {
			res.redirect("calendar");
		}
	});
});

/* List event details */
router.get('/calendar/:eventId', function(req, res) {	
	/* MongoDB database connections */
	var db = req.db;
	var collection = db.get('events');
	
	/* Given ID of event */
	var eID = mongo.ObjectID(req.params.eventId);	

	/* Find the event by ID and render the site */
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
	/* MongoDB database connections */
	var db = req.db;
	var collection = db.get('events');
	
	/* Given ID of event */
	var eID = mongo.ObjectID(req.params.eventId);
	
	/* Remove Event by ID */
	collection.remove({"_id" : eID}, function(err, post) {
		if (err) return next(err);
		else res.redirect("calendar");
	});
});

/* Update an existing event */
router.put('/calendar/:eventId', function(req, res) {
	/* MongoDB database connections */
	var db = req.db;
	var collection = db.get('events');
	var usercollection = db.get('users');
	
	/* Given ID of event */
	var eID = mongo.ObjectID(req.params.eventId);
	
	/* Define the required variables */
	var user = usercollection.findOne({"username" : req.body.username})._id;
	var title = req.body.title;
	var description = req.body.description;
	var start = req.body.startDate;
	var end = req.body.endDate;	
	
	/* Find the event by ID and update */
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