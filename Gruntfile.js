'use strict';

module.exports = function(grunt) {

  var js_files = [
    'src/supergallery.js',
    'src/jquery.transit.js'
  ];

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('supergallery.jquery.json'),
    banner:'/*! <%= pkg.title %> <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' *  Vertion : <%= pkg.version %>\n'+
      ' *  Dependencies : jQuery <%= pkg.dependencies.jquery %>\n'+
      ' *  Author : <%= pkg.author.name %>\n'+
      ' *  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
      ' *  License : <%= pkg.licenses[0].type %> <%= pkg.licenses[0].url %>\n' + 
      ' *  ----\n' +
      ' *  jQuery Transit - CSS3 transitions and transformations, \n' +
      ' *  (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>, \n' +
      ' *  MIT Licensed. \n' +
      ' * \n' +
      ' *  http://ricostacruz.com/jquery.transit \n'+
      ' *  http://github.com/rstacruz/jquery.transit */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: js_files,
        dest: 'dist/jquery-<%= pkg.name %>-plugin2.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jquery-<%= pkg.name %>-plugin2.min.js'
      },
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/supergallery.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    less:{
      options:{
        banner: '<%= banner %>',
      },
      dist:{
        src:['src/*.less'],
        dest: 'dist/jquery-<%= pkg.name %>2-plugin.css'
      },
      demo:{
        src:['demo/style.less'],
        dest: 'demo/style.css'
      }
    },
    cssmin:{
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= less.dist.dest %>',
        dest: 'dist/jquery-<%= pkg.name %>-plugin2.min.css'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      less:{
        files: '<%= less.dist.src %>',
        tasks:['less','cssmin']
      },
      demo:{
        files:'<%= less.demo.src %>',
        tasks:['less:demo']
      },
      src: {
        files: 'src/**/*.js',
        tasks: ['jshint:src','clean','concat','uglify']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify','less','cssmin']);
  grunt.registerTask('test',['jshint', 'qunit', 'clean', 'concat', 'uglify','less','cssmin']);

};
