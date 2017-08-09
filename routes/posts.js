var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');
//var upload = multer({ dest : '../public/images/uploads'});
var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, 'public/images/uploads')
	},
	filename: function(req, file, cb){
		cb(null, Date.now()+ '.jpg')
	}
});
router.get('/add', function(req, res, next){
	var categories = db.get('categories');
	categories.find({},{},function(err, categories){
		res.render('addpost', {
			"title":"Add post",
			"categories":categories
		});
		
	});
});

var upload = multer({storage: storage});

router.post('/add', upload.single('mainimage'),function(req, res, next){
	// get the form values
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();
	console.log('************************* ' + req.file);
	console.log('************************* ' + req.files.mainimage);
	if(req.files.mainimage){
		var mainImageOriginalName 	= req.files.mainimage.originalname;
		var mainImageName 			= req.files.mainimage.name;
		var mainImageMime 			= req.files.mainimage.mimetype;
		var mainImagePath 			= req.files.mainimage.path;
		var mainImageExt 			= req.files.mainimage.extension;
		var mainImageSize 			= req.files.mainimage.size;
	}else{
		var mainImageName = 'noimage.png';
	}

	//Form validation
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required');

	//Check errors
	var errors = req.validationErrors();

	if(errors){
		res.render('/addpost', {
			"errors": errors,
			"title":title,
			"body":body
		});
	}else{
		var posts = db.get('posts');

		//Submit to DB
		posts.insert({
			"title":title,
			"body":body,
			"category":category,
			"date":date,
			"author":author,
			"mainimage":mainImageName
		}, function(err, post){
			if (err){
				res.send('There was an issue submitting the post');
			}else{
				req.flash('success', 'Post submitted successfully');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;