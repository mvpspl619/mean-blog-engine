'use strict';

angular.module('meanBlog', ['ngRoute', 'btford.markdown']).config(['$locationProvider', '$routeProvider', '$httpProvider',
 function($locationProvider, $routeProvider, $httpProvider){
 	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', {
		templateUrl: '/src/views/blog.html',
		controller: 'blogController'
	})
	.when('/blog/:id/:title', {
		templateUrl: '/src/views/single-blog.html',
		controller: 'singleBlogController'
	})
	.when('/blog/new', {
		templateUrl: '/src/views/new-blog.html',
		controller: 'newBlogController'
	})
	.otherwise({redirecTo: '/'});
	
	//enable cors
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
angular.module('meanBlog').controller('blogController', ['$scope', 'postReaderService',  function($scope, postReaderService){
	$scope.posts = [];
	postReaderService.getPosts().then(function(response){
		$scope.posts = response;
	}, function(error){
		console.log(error)
	});
}]);
angular.module('meanBlog').controller('singleBlogController', ['$scope', '$routeParams', 'postReaderService', function($scope, $routeParams, postReaderService){
	postReaderService.getPost($routeParams.id).then(function(data){
		$scope.post = data;
	}, function(error){
		console.log(error);
	})
}]);
angular.module('meanBlog').controller('newBlogController', ['$scope', 'postReaderService', function($scope, postReaderService){
	$scope.post = {};
	$scope.savePost = function(){
		var thisPost = $scope.post;
		postReaderService.createPost(new post(thisPost.author, thisPost.title, thisPost.content)).then(function(data){
			console.log('Save succesful');
		}, function(error){
			console.log('Save failed :(');
		})
	}

	function post(author, title, content){
		var buildDirectLink = function(title){
			title = title.replace(/[^a-zA-Z ]/g, "")
			if (title[title.length - 1] === " ") title = title.substring(0, title.length - 1)
			return title.replace(/[ ]/g, "-").toLowerCase();
		}
		this.author = author;
		this.title = title;
		this.directLink = buildDirectLink(title);
		this.content = JSON.stringify(content);
	}
}]);
angular.module('meanBlog').factory('postReaderService', ['$q', '$http', function($q, $http){
	
	var getPosts = function(){
		var httpConfig = $http({
			'url': '/api/posts',
			'method': 'GET'
		})
		return sendRequest(httpConfig);
	}

	var getPost = function(id){
		var httpConfig = $http({
			'url': '/api/post/' + id,
			'method': 'GET'
		})
		return sendRequest(httpConfig);
	}

	var createPost = function(post){
		var httpConfig = $http({
			'url': '/api/post',
			'method': 'POST',
			'data': post
		})
		return sendRequest(httpConfig);
	}

	var sendRequest = function(config){
		var def = $q.defer();
		config.success(function(data){
			def.resolve(data);
		}).error(function(error){
			console.log('Error occured:' + error);
			def.reject(error);
		});
		return def.promise;
	}

	return {
		getPosts: getPosts,
		getPost: getPost,
		createPost: createPost
	}
}]);