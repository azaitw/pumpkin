'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');
var testCommands = ['cd <%=file.path %>;npm install ../..;npm prune;cp -R ../../node_modules node_modules;npm install;npm run-script disc;npm test'];

gulp.task('unit_test', function () {
    return gulp.src('test/**/*.spec.js', {read: false})
        .pipe(mocha({
            reporter: 'spec',
            globals: '*',
            timeout: 5000
        }));
});

gulp.task('coverage', function () {
    return gulp.src(['api/**/*.js', '*.js'])
        .pipe(istanbul({includeUntested: true}))
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(['test/**/*.spec.js'])
            .pipe(mocha())
            .pipe(istanbul.writeReports());
        });
});

gulp.task('lint', function() {
  return gulp.src(['api/**/*.js', 'config/**/*.js', 'test/**/*.js', '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('smoke_test', function () {
    return gulp.src('examples/00hello/')
    .pipe(shell(testCommands));
});

gulp.task('watch_document', ['build_document'], function () {
    return gulp.watch(['README.md', 'index.js', 'lib/*.js', 'extra/*.js'], ['build_document']);
});

gulp.task('build_document', shell.task('jsdoc -p README.md index.js lib/*.js extra/*.js -d documents'));
