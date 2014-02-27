'use strict';

var	base_js = "app/scripts/";

var	js_src_order =
[
	base_js + "vendor/*.js",
	base_js + "core/*.js",
	base_js + "plugins.js",
	base_js + "main.js"
]

module.exports = function(grunt) {
	// Show elapsed time at the end
	require('time-grunt')(grunt);

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: "/* Manta */\n",//grunt.file.read('muffin.banner'),
		// Task configuration.
		clean: {
			files: ['dist']
		},
		less: {
			development: {
				options: {
					paths: ["app/less", "app/less/vendor", "app/less/bootstrap"]
				},
				files: {
					"css/<%= pkg.name %>.css": "app/less/main.less"
				}
			},
			production: {
				options: {
					paths: ["app/less", "app/less/vendor", "app/less/bootstrap"],
					cleancss: true
				},
				files: {
					"css/<%= pkg.name %>.min.css": "app/less/main.less"
				}
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: js_src_order,
				dest: 'js/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'js/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			src: {
				src: ['Gruntfile.js', 'app/**/*.js', 'app/js/*.js',
					'less/**/*.less', 'less/bootstrap/*.less']
			}
		},
		watch: {
			src: {
				files: ['Gruntfile.js','app/scripts/**/*.js',
					'app/scripts/*.js', 'app/less/**/*.less', 'app/less/bootstrap/*.less'],
				tasks: ['dev:src']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify']);
	grunt.registerTask('server', ['watch']);
	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('dev', ['clean', 'concat', 'uglify', 'less:development']);
	grunt.registerTask('prod', ['clean', 'concat', 'uglify', 'less:production']);
};
