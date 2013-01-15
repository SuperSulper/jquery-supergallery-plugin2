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
			},
			less : {
				files : ['demo/style.less'],
				tasks : 'less'
			}
		},
		concat:  {
			dist : {
				src : jsFiles,
				dest : 'jquery-supergallery-plugin2.js'
			}
		},
		less :{
			dist:{
				src:['demo/style.less'],
				dest: 'demo/style.css'
			}
		},
		min: {
			dist :{
				src : ['jquery-supergallery-plugin2.js'],
				dest : 'jquery-supergallery-plugin2.min.js'
			}
		}
	});
	grunt.registerTask('default', 'concat min less');
};