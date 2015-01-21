'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        clean: ['dist/*.*'],
        concat: {
            dist: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: "'use strict';\n",
                    process: function(src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                files: {
                    'dist/angular-watchcount.js': ['src/main.js', 'src/service.js', 'src/directive.js'],
                }
            },
        },
        uglify: {
            options: {
                mangle: true
            },
            release: {
                files: {
                    'dist/angular-watchcount.min.js': ['dist/angular-watchcount.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('release', ['clean', 'concat', 'uglify:release']);
}
