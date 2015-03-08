'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');
var testCommands = ['cd <%=file.path %>;npm install ../..;npm prune;cp -R ../../node_modules node_modules;npm install;npm run-script disc;npm test'];

gulp.task('unit_test', function () {
    return gulp.src('test/**/*.spec.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('smoke_test', function () {
    return gulp.src('examples/00hello/')
    .pipe(shell(testCommands));
});

gulp.task('example_tests', function () {
    return gulp.src('examples/*-*/')
    .pipe(shell(testCommands));
});

gulp.task('watch_document', ['build_document'], function () {
    return gulp.watch(['README.md', 'index.js', 'lib/*.js', 'extra/*.js'], ['build_document']);
});

gulp.task('build_document', shell.task('jsdoc -p README.md index.js lib/*.js extra/*.js -d documents'));

gulp.task('lint', function() {
  return gulp.src(['api/**/*.js', 'config/**/*.js', 'test/**/*.js', '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});