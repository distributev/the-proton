'use strict';

import gulp from 'gulp';
const builder = require('electron-builder');
import plumber from 'gulp-plumber';

gulp.task('package-osx', ['build:prod'], (done) => {

    builder.build({
            targets: builder.Platform.MAC.createTarget(),
            config: {}
        })
        .then(() => {
            done();
        })
        .catch(error => {
            done(error);
        });
});

gulp.task('package-linux', ['build:prod'], (done) => {

    builder.build({
            targets: builder.Platform.LINUX.createTarget(null, builder.Arch.ia32, builder.Arch.x64),
            config: {}
        })
        .then(() => {
            done();
        })
        .catch(error => {
            done(error);
        });
});

gulp.task('package-win', ['build:prod'], (done) => {

    builder.build({
            targets: builder.Platform.WINDOWS.createTarget(null, builder.Arch.ia32, builder.Arch.x64),
            config: {}
        })
        .then(() => {
            done();
        })
        .catch(error => {
            done(error);
        });
});