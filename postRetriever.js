var fs = require('fs')

var postsDirectory = '/posts'

var directoryReader = function(directoryName){
	return fs.readdirSync(directoryName)
}

exports.getAllPosts = function(req, res){
	var files = directoryReader(process.cwd() + postsDirectory)
	var posts = []
	files.forEach(function(file){
		var fileContent = JSON.parse(fs.readFileSync(process.cwd() + postsDirectory + '/' + file, 'utf-8'))
		console.log(fileContent)
		posts.push(fileContent)
	})
	res.status(200).send(posts)
}

exports.getSinglePost = function(req, res){
	var id = req.params.id
	res.status(200).send(fs.readFileSync(process.cwd() + postsDirectory + '/' + id + '.json', 'utf-8'))
}