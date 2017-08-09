var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


//console.log('******in index js*********');

//Homepage blog posts
router.get('/', function(req, res, next) {
//console.log('***** we are in index route ***********');
  var db = req.db;
  //console.log('**** db req passes***')
  var posts = db.get('posts');
  //console.log('******8 we got the posts**********');
  posts.find({},{},function(err, posts){
  	//console.log('**** just gonna render the page*********8')
  	res.render('index',{
  		"posts":posts
  	});
  	//console.log('page rendered')
  });
});

module.exports = router;
