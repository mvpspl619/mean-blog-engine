var mongojs = require('mongojs')
var uri = "mongodb://admin:admin123@ds051160.mongolab.com:51160/heroku_app31284923"
var db = mongojs.connect(uri, ["posts", "users"])
var jwt = require('jsonwebtoken');
var secret = require('./secret')

exports.authenticate = function(req, res){
	var username = req.body.username || '';
    var password = req.body.password || '';
    if (username == '' || password == '') return res.status(401).send('User does not exist');
	db.users.findOne({"username": username, "password": password}, function(err, user){
		if (err) return res.send(500).send('An error occured while retrieving data from database');
		if (user === null) return res.status(401).send('User does not exist');
		user.exp = Date.now() + 3600000;
		var token = jwt.sign(user, secret.secretToken);
		var response = {
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			token: token
		}
		return res.status(200).send(response);
	})
}

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

exports.jwt = jwt;