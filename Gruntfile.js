/*eslint-env node */

module.exports = function (grunt) {
    'use strict';

    grunt.util.linefeed = '\n';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: (
            "/*!\n * mq4-hover-hover-shim v<%= pkg.version %>\n" +
            " * <%= pkg.homepage %>\n" +
            " * Copyright (c) 2014 Christopher Rebert\n" +
            " * Licensed under the MIT License (https://github.com/cvrebert/mq4-hover-hover-shim/blob/master/LICENSE).\n" +
            " */\n"
        ),

        '6to5': {
            options: {
                modules: "common" // output a CommonJS module
            },
            dist: {
                files: {
                    'dist/cjs/<%= pkg.name %>.js': 'src/browser/<%= pkg.name %>.js'
                }
            }
        },
        browserify: {
            options: {
                banner: '<%= banner %>',
                browserifyOptions: {
                    standalone: 'mq4HoverShim'
                }
            },
            dist: {
                src: 'dist/cjs/<%= pkg.name %>.js',
                dest: 'dist/browser/<%= pkg.name %>.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['src/**/*.js']
            },
            test: {
                src: ['test/**/*.js', '!test/lib/**/*.js']
            }
        },
        jscs: {
            gruntfile: {
                src: '<%= jshint.gruntfile.src %>'
            },
            lib: {
                src: '<%= jshint.lib.src %>'
            },
            test: {
                src: '<%= jshint.test.src %>'
            }
        },
        eslint: {
            options: {
                config: '.eslintrc'
            },
            gruntfile: {
                src: '<%= jshint.gruntfile.src %>'
            },
            lib: {
                src: ['src/**/*.js', '!src/browser/**/*.js']
            },
            test: {
                src: '<%= jshint.test.src %>'
            }
        },
        nodeunit: {
            files: ['test/**/*_test.js']
        }
    });

    // Tasks
    grunt.registerTask('lint', ['jshint', 'eslint', 'jscs']);
    grunt.registerTask('dist', ['6to5', 'browserify']);
    grunt.registerTask('test', ['lint', 'dist', 'nodeunit']);
    grunt.registerTask('default', ['test']);
};
