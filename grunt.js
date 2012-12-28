/*global module:false*/
module.exports = function(grunt){

	var jsFiles = [
		'src/header.js',
		'src/core.js',
		'src/footer.js'
	];

	grunt.initConfig({
		//lint
		lint: {
			files : [
				'grunt.js',
				'src/core.js'
			]
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true
			}
		},
		//watch
		watch : {
			dist : {
				files : jsFiles,
				tasks:'concat min'
			}
		},
		concat:  {
			dist : {
				src : jsFiles,
				dest : 'jquery-supergallery-plugin2.js'
			}
		},
		min: {
			dist :{
				src : ['jquery-supergallery-plugin2.js'],
				dest : 'jquery-supergallery-plugin2.min.js'
			}
		}
	});
	grunt.registerTask('default', 'concat min');
};