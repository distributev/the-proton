'use strict';

import gulp from 'gulp';
import del from 'del';
const builder = require('electron-builder');
import plumber from 'gulp-plumber';
import runSequence from 'run-sequence';

gulp.task('build-mac', ['build:prod'], (done) => {

    builder.build({
            targets: builder.Platform.MAC.createTarget(),
            devMetadata: {
                directories: {
                    app: 'dist'
                }
            }
        })
        .then(() => {
            done();
        })
        .catch(error => {
            done(error);
        });
});

gulp.task('build-linux', ['build:prod'], (done) => {

    builder.build({
            targets: builder.Platform.LINUX.createTarget(null, builder.Arch.ia32),
            devMetadata: {
                directories: {
                    app: 'dist'
                }
            }
        })
        .then(() => {
            done();
        })
        .catch(error => {
            done(error);
        });
});

gulp.task('build-win', ['build:prod'], (done) => {

    builder.build({
            targets: builder.Platform.WINDOWS.createTarget(null, builder.Arch.ia32),
            devMetadata: {
                directories: {
                    app: 'dist'
                }
            }
        })
        .then(() => {
            done();
        })
        .catch(error => {
            done(error);
        });
});

gulp.task('clean:package-win', () => del(['release/*win*.zip']));

gulp.task('clean:build-win-unpacked', () => del(['release/win-*']));

gulp.task('clean:package-linux', () => del(['release/*linux*.zip']));

gulp.task('clean:build-linux-unpacked', () => del(['release/linux-*']));

gulp.task('clean:package-mac', () => del(['release/*mac.zip']));

gulp.task('copy:zip:mac', () => {
    return gulp.src(['release/mac/*mac.zip'])
        .pipe(gulp.dest('release'))
});

gulp.task('clean:build-mac-unpacked', () => del(['release/mac']));

gulp.task('package-win', done => {
    runSequence(
        'clean:package-win',
        'build-win',
        'clean:build-win-unpacked',
        done
    );
});

gulp.task('package-linux', done => {
    runSequence(
        'clean:package-linux',
        'build-linux',
        'clean:build-linux-unpacked',
        done
    );
});

gulp.task('package-mac', done => {
    runSequence(
        'clean:package-mac',
        'build-mac',
        'copy:zip:mac',
        'clean:build-mac-unpacked',
        done
    );
});

gulp.task('package-osx', ['package-mac']);