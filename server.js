var express = require('express')
var fs = require('fs')
var postsRetriever = require('./postRetriever')
var app = express()
var port = Number(9000)
var staticDirectory = "\\src"

app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept')
    next()
});

app.use('/src', express.static(__dirname + staticDirectory))

app.use('/api/posts', postsRetriever.getAllPosts)

app.use('/api/post/:id', postsRetriever.getSinglePost)

app.get('/*', function(req, res){
	res.status(200).sendFile(__dirname + '/index.html')
})

module.exports = app.listen(port, function(){
	console.log("Express server listening on port " + port)
})