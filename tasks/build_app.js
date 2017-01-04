'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var electron = require('electron-connect').server.create( { stopOnClose: true } );
// var bundle = require('./bundle');
var utils = require('./utils');
var runSequence = require('run-sequence');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./dist');

gulp.task('bundle:background', ['webpack:dev'], function (done) {
    // return bundle(srcDir.path('background.js'), destDir.path('background.js'));
    done();
});

gulp.task('bundle:app', ['webpack:dev'], function (done) {
    // return bundle(srcDir.path('app.js'), destDir.path('app.js'));
    done();
});

// gulp.task('less', function () {
//     return gulp.src(srcDir.path('stylesheets/main.less'))
//         .pipe(plumber())
//         .pipe(less())
//         .pipe(gulp.dest(destDir.path('stylesheets')));
// });

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
    var beepOnError = function (done) {
        return function (err) {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };
    
    watch('src/background.js', batch( function(events, done) { 
        runSequence(
            'bundle:background',
            'reload:browser',
            beepOnError(done)
        )
    }));
    watch(['src/**/*.js', '!src/background.js'], batch( function(events, done) { 
        runSequence(
            'bundle:app',
            'reload:renderer',
            beepOnError(done)
        )
    }));
    watch('src/**/*.less', batch( function(events, done) { 
        runSequence(
            'less',
            'reload:renderer',
            beepOnError(done)
        )
    }));
});

gulp.task('reload:browser', function (done) {
  // Restart Electron's main process
  electron.restart();
  done();
});

gulp.task('reload:renderer', function (done) {
  // Reload Electron's renderer process
  electron.reload();
  done();
});

gulp.task('bundle', ['bundle:background', 'bundle:app']);

gulp.task('build', ['clean:dist', 'bundle', 'environment']);
