var express = require('express')
var fs = require('fs')
var postsRetriever = require('./postRetriever')
var app = express()
var port = Number(process.env.PORT || 3000)
var staticDirectory = "\\src"

app.use('/src', express.static(__dirname + '/src'))
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
})
app.get('/api/posts', postsRetriever.getAllPosts)
app.get('/api/post/:id', postsRetriever.getSinglePost)
app.use(function(req, res){
	res.sendFile(__dirname + '/index.html');
})
module.exports = app.listen(port, function(){
	console.log("Express server listening on port " + port)
})