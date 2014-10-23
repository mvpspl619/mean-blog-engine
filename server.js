var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')
var postService = require('./postService')
var app = express()
var port = Number(process.env.PORT || 3000)
var staticDirectory = "\\src"

app.use(bodyParser.json())
//serves the static files first
app.use('/src', express.static(__dirname + '/src'))

//serves the root request
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
})

//serves the api
app.get('/api/posts', postService.getPosts)
app.get('/api/post/:id', postService.getPost)
app.post('/api/post', postService.createPost)
//serve any unhandled request(which dont match the above)
app.use(function(req, res){
	res.sendFile(__dirname + '/index.html');
})
module.exports = app.listen(port, function(){
	console.log("Express server listening on port " + port)
})