'use strict';

var childProcess = require('child_process');
var gulp = require('gulp');
var electron = require('electron-connect').server.create( { 
    stopOnClose: true,
    path: 'dist'
} );

gulp.task('start', ['build', 'watch'], function () {
    electron.start(function(state) {
        if (state == 'stopped') {
            process.exit();
        }
    });
});
