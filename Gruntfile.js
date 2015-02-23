/*eslint-env node */

module.exports = function (grunt) {
    'use strict';

    grunt.util.linefeed = '\n';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: (
            "/*!\n * mq4-hover-shim v<%= pkg.version %>\n" +
            " * <%= pkg.homepage %>\n" +
            " * Copyright (c) 2014-2015 Christopher Rebert\n" +
            " * Licensed under the MIT License (https://github.com/twbs/mq4-hover-shim/blob/master/LICENSE).\n" +
            " */\n"
        ),

        babel: {
            options: {
                loose: ['es6.modules'],
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
                    standalone: 'mq4HoverShim',
                    bundleExternal: false
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
                src: ['src/**/*.js']
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
    grunt.registerTask('dist', ['babel', 'browserify']);
    grunt.registerTask('test', ['lint', 'dist', 'nodeunit']);
    grunt.registerTask('default', ['test']);
};
