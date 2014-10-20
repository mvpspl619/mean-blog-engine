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
	.otherwise({redirecTo: '/'});
	
	//enable cors
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
angular.module('meanBlog').controller('blogController', ['$scope', 'postReaderService',  function($scope, postReaderService){
	$scope.posts = [];
	postReaderService.getAllPosts().then(function(response){
		$scope.posts = response;
	}, function(error){
		console.log(error)
	});
}]);
angular.module('meanBlog').controller('singleBlogController', ['$scope', '$routeParams', 'postReaderService', function($scope, $routeParams, postReaderService){
	var init = function(){
		postReaderService.getSinglePost($routeParams.id).then(function(data){
			$scope.post = data;
		}, function(error){
			console.log(error);
		})
	}
	init();
}]);
angular.module('meanBlog').factory('postReaderService', ['$q', '$http', function($q, $http){
	var getAllPosts = function(){
		var def = $q.defer();
		var httpConfig = $http({
			'url': '/posts',
			'method': 'GET'
		})
		return sendRequest(httpConfig);
	}

	var getSinglePost = function(id){
		var httpConfig = $http({
			'url': '/post/' + id,
			'method': 'GET'
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
		getAllPosts: getAllPosts,
		getSinglePost: getSinglePost
	}
}]);