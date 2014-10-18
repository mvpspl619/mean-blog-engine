'use strict';

module.exports = function(grunt){
	grunt.initConfig({
		express: {
			server: {
				options: {
					script: 'server.js',
					background: false
				}
			}
		}
	})

	grunt.loadNpmTasks('grunt-express-server');
	grunt.registerTask('default', ['express:server']);
}