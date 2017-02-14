'use strict';

import gulp from 'gulp';
import del from 'del';
import fs from 'fs-extra';
import zip from 'gulp-zip';
const builder = require('electron-builder');
import plumber from 'gulp-plumber';
import runSequence from 'run-sequence';
import packageConfig from '../package.json';

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
            targets: builder.Platform.LINUX.createTarget(null, builder.Arch.ia32, builder.Arch.x64),
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
            targets: builder.Platform.WINDOWS.createTarget(null, builder.Arch.ia32, builder.Arch.x64),
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

gulp.task('clean:package-win', () => del([
    `release/${packageConfig.productName}-*-win-ia32.zip`,
    `release/${packageConfig.productName}-*-win-x64.zip`
]));

gulp.task('copy:package-win:32', done => {
    let destDir = `release/${packageConfig.productName}-${packageConfig.version}-win-ia32/_internal`;
    fs.ensureDir(destDir, err => {
        if (err) done(err);
        fs.copy('release/win-ia32-unpacked', destDir, err => {
            if (err) done(err);
            done();
        });
    });
});

gulp.task('copy:package-win:64', done => {
    let destDir = `release/${packageConfig.productName}-${packageConfig.version}-win-x64/_internal`;
    fs.ensureDir(destDir, err => {
        if (err) done(err);
        fs.copy('release/win-unpacked', destDir, err => {
            if (err) done(err);
            done();
        });
    });
});

gulp.task('package-win:shortcut:32', done => {
    const shortcut = require('windows-shortcuts');
    let appPath = `%__CD__%release/${packageConfig.productName}-${packageConfig.version}-win-ia32`;
    let shortcutPath = appPath + `/${packageConfig.productName}.lnk`;
    let exePath = appPath + `/_internal/${packageConfig.productName}.exe`;
    shortcut.create(shortcutPath, exePath, err => {
        if (err) {
            done(err);
        }
        else done();
    });
});

gulp.task('package-win:shortcut:64', done => {
    const shortcut = require('windows-shortcuts');
    let appPath = `%__CD__%release/${packageConfig.productName}-${packageConfig.version}-win-x64`;
    let shortcutPath = appPath + `/${packageConfig.productName}.lnk`;
    let exePath = appPath + `/_internal/${packageConfig.productName}.exe`;
    shortcut.create(shortcutPath, exePath, err => {
        if (err) {
            done(err);
        }
        else done();
    });
});

gulp.task('package-win:zip:32', () => {
    return gulp.src(`release/${packageConfig.productName}-${packageConfig.version}-win-ia32/**/*`)
        .pipe(zip(`${packageConfig.productName}-${packageConfig.version}-win-ia32.zip`))
        .pipe(gulp.dest('release'));
});

gulp.task('package-win:zip:64', () => {
    return gulp.src(`release/${packageConfig.productName}-${packageConfig.version}-win-x64/**/*`)
        .pipe(zip(`${packageConfig.productName}-${packageConfig.version}-win-x64.zip`))
        .pipe(gulp.dest('release'));
});

gulp.task('clean:package-win-unpacked', () => del([
    // 'release/win-ia32-unpacked',
    // 'release/win-unpacked',
    'release/*win-*',
    '!release/*.zip'
]));

gulp.task('clean:package-linux', () => del(['release/*linux.zip']));

gulp.task('clean:build-linux-unpacked', () => del(['release/linux-ia32-unpacked']));

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
        'copy:package-win:32',
        'package-win:shortcut:32',
        'package-win:zip:32',
        'copy:package-win:64',
        'package-win:shortcut:64',
        'package-win:zip:64',
        'clean:package-win-unpacked',
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
