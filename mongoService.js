var mongojs = require('mongojs')
var uri = "mongodb://admin:admin123@ds047930.mongolab.com:47930/heroku_app30864510"
var db = mongojs.connect(uri, ["posts"])

exports.getPosts = function(req, res){
	db.posts.find().sort({_id:0}, function(err, documents){
		if(err){
			res.status(500).send('An error occured while retrieving data from database')
		}
		res.status(200).send(documents)
	})
}

exports.getPost = function(req, res){
	var id = req.params.id;
	db.posts.findOne({"_id": parseInt(id)}, function(err, document){
		if(err){
			res.status(500).send('An error occured while retrieving data from database')
		}
		if(document === null) res.status(404).send("Post not found");
		else res.status(200).send(document);
	})
}

exports.createPost = function(req, res){

	db.posts.find({}, {_id:1}).limit(1).sort({_id:-1}, function(err, document){
		if(err){
			res.status(500).send('An error occured while processing your request')
		}
		var post = req.body;
		document.length === 0 ? post._id = 1 : post._id = parseInt(document[0]._id) + 1;
		db.posts.save(post, function(err, message){
			if(err){
				res.status(500).send('An error occured while saving the post')
			}
			res.status(201).send({"message": "Post created successfully", "_id": post._id})
		})
	})
}