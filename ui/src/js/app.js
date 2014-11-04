'use strict';

angular.module('spine', ['ngRoute', 'ngMessages', 'btford.markdown']).config(['$locationProvider', '$routeProvider', '$httpProvider',
 function($locationProvider, $routeProvider, $httpProvider){
 	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', {
		templateUrl: '/src/views/blog.html',
		controller: 'blogController'
	})
	.when('/login', {
		templateUrl: '/src/views/login.html',
		controller: 'loginController'
	})
	.when('/signup', {
		templateUrl: '/src/views/signup.html',
		controller: 'loginController'
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
angular.module('spine').controller('navbarController', ['$scope', 'authenticationService', function($scope, authenticationService){
	$scope.user = authenticationService.loggedInUser;
	$scope.logout = authenticationService.logout;
}]);
angular.module('spine').controller('loginController', ['$scope', '$window', 'authenticationService', function($scope, $window, authenticationService){
	$scope.login = function(){
		var user = new User($scope.username, $scope.password);
		authenticationService.login(user).then(function(data){
			authenticationService.loggedInUser.isauthenticated = true;
			authenticationService.loggedInUser.firstname = data.firstname;
			authenticationService.loggedInUser.lastname = data.lastname;
			//$window.location.href = '/';
		}, function(error){
			console.log('Login unsuccessful');
		})
	}
	function User(username, password){
		this.username = username;
		this.password = password;
	}
}]);
angular.module('spine').controller('blogController', ['$scope', 'postReaderService',  function($scope, postReaderService){
	$scope.posts = [];
	postReaderService.getPosts().then(function(response){
		$scope.posts = response;
	}, function(error){
		console.log(error)
	});
}]);
angular.module('spine').controller('singleBlogController', ['$scope', '$routeParams', 'postReaderService', function($scope, $routeParams, postReaderService){
	postReaderService.getPost($routeParams.id).then(function(data){
		$scope.post = data;
	}, function(error){
		console.log(error);
	})
}]);
angular.module('spine').controller('newBlogController', ['$scope', 'postReaderService', 'authenticationService', function($scope, postReaderService, authenticationService){
	$scope.post = {};
	$scope.unsaved = true;
	$scope.savePost = function(){
		if(!$scope.newPostForm.$valid) return;
		var thisPost = $scope.post;
		postReaderService.createPost(new post(thisPost.author, thisPost.title, thisPost.content)).then(function(data){
			console.log('Save successful');
			$scope.unsaved = false;
			$scope.post = {};
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
		this.content = content;
	}

	var init = function(){
		if(!authenticationService.loggedInUser.isauthenticated){
			//navigate to something else
			console.log('User is not authorized to see this page.');
		}
	};

	init();
}]);
angular.module('spine').factory('authenticationService', ['$q', '$http', function($q, $http){
	var login = function(user){
		var def = $q.defer();
		var httpConfig = $http({
			'url': '/api/login',
			'method': 'POST',
			'data': user
		})
		httpConfig.success(function(response){
    		$http.defaults.headers.common['Authorization'] = response.token;
			def.resolve(response);
		}).error(function(error){
			def.reject(error);
		});
		return def.promise;
	}

	var loggedInUser = {
			firstname: '',
			lastname: '',
			isauthenticated: false
		}

	var logout = function(){
		delete $http.defaults.headers.common['Authorization'];
		loggedInUser.firstname = '';
		loggedInUser.lastname = '';
		loggedInUser.isauthenticated = false;
	}

	return {
		login: login,
		logout: logout,
		loggedInUser: loggedInUser
	}
}]);
angular.module('spine').factory('postReaderService', ['$q', '$http', function($q, $http){
	
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