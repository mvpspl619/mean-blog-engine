var fs = require('fs')

var postsDirectory = '/posts'

var directoryReader = function(directoryName){
	return fs.readdirSync(directoryName)
}

exports.getPosts = function(req, res){
	var files = directoryReader(process.cwd() + postsDirectory)
	var posts = []
	files.forEach(function(file){
		var fileContent = JSON.parse(fs.readFileSync(process.cwd() + postsDirectory + '/' + file, 'utf-8'))
		console.log(fileContent)
		posts.push(fileContent)
	})
	res.status(200).send(posts)
}

exports.getPost = function(req, res){
	var id = req.params.id
	res.status(200).send(fs.readFileSync(process.cwd() + postsDirectory + '/' + id + '.json', 'utf-8'))
}

exports.createPost = function(req, res){
	fs.writeFileSync(process.cwd() + postsDirectory + '/myPost.json', JSON.stringify(req.body))
	res.status(200).send({"message": "Post created successfully", "id": 99})
}