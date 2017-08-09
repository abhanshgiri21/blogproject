var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


router.get('/add', function(req, res, next) {
	res.render('addcategory',{
		"title":"Add Category"
	});
});

router.post('/add', function(req, res, next){
	// get the form values
	var title = req.body.title;

	

	//Form validation
	req.checkBody('title', 'Title field is required').notEmpty();

	//Check errors
	var errors = req.validationErrors();

	if(errors){
		res.render('/addpost', {
			"errors": errors,
			"title":title
		});
	}else{
		var categories = db.get('categories');

		//Submit to DB
		categories.insert({
			"title":title,
		}, function(err, category){
			if (err){
				res.send('There was an issue submitting the category');
			}else{
				req.flash('success', 'category submitted successfully');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});


module.exports = router;
