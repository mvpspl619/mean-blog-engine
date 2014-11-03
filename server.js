var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')
var mongoService = require('./api/mongoService')
var jwtauth = require('./api/jwtauth')
var app = express()
var port = Number(process.env.PORT || 3000)
var staticDirectory = "\\src"

app.use(bodyParser.json())
//serves the static files first
app.use('/src', express.static(__dirname + '/ui/src'))

//serves the root request
app.get('/', function(req, res){
	res.sendFile(__dirname + '/ui/index.html');
})

//serves the login
app.post('/api/login', mongoService.authenticate)

//serves the api
app.get('/api/posts', mongoService.getPosts)
app.get('/api/post/:id', mongoService.getPost)
app.post('/api/post', jwtauth, mongoService.createPost)
//serve any unhandled request(which dont match the above)
app.use(function(req, res){
	res.sendFile(__dirname + '/ui/index.html');
})
module.exports = app.listen(port, function(){
	console.log("Express server listening on port " + port)
})