
/* vim: set foldmethod=marker foldmarker=homoioskedasticita,homoeroticismus:
**/
// Source: https://gist.github.com/jshawl/6225945
const sass = require('node-sass')
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          // style: 'compressed'
          implementation: sass,
          style: 'nested'// Output human readable code while in development TODO: learn build x dist difference but whatevs
        },
        files: [
          {
            expand: true,
            cwd: './css/scss/',
            src: ['*.scss'],
            dest: 'css/',
            ext: '.css'
          }
        ]
      }
    },
    autoprefixer: {
      dist: {
        files:
        [
          {
            expand: true,
            cwd: 'css',
            src: ['*.css'],
            dest: 'css/',
            ext: '.css'
          }
        ]

      },
    },
    browserSync: {
      files: {
        src : ['css/*.css',
          '*.html',
          '!**/node_modules/**',
        ],
      },
      options: {
        server: {
          baseDir: "./"
        },
        watchTask: true,
        open: true,
      }
    },
    watch: {
      css: {
        files: 'css/scss/**/*.scss',
        tasks: ['sass', 'autoprefixer'],

      },
    },
    default: {

    }
  })
  grunt.loadNpmTasks('grunt-browser-sync')
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-autoprefixer')
  grunt.registerTask('default', ['browserSync', 'watch'])
}
