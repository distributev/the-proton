'use strict';

var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var istanbul = require('rollup-plugin-istanbul');
import runSequence from 'run-sequence';
import os from 'os';
import {
    protractor,
    webdriver_update
} from 'gulp-protractor';

// Spec files are scattered through the whole project. Here we're searching
// for them and generate one entry file which will run all the tests.
var generateEntryFile = function (dir, destFileName, filePattern) {
    var fileBanner = "// This file is generated automatically.\n" +
        "// All modifications will be lost.\n";

    return dir.findAsync('.', {
            matching: filePattern
        })
        .then(function (specPaths) {
            var fileContent = specPaths.map(function (path) {
                return 'import "./' + path.replace(/\\/g, '/') + '";';
            }).join('\n');
            return dir.writeAsync(destFileName, fileBanner + fileContent);
        })
        .then(function () {
            return dir.path(destFileName);
        });
};

gulp.task('build-unit', ['environment'], function () {
    var srcDir = jetpack.cwd('src');
    var destDir = jetpack.cwd('app');

    return generateEntryFile(srcDir, 'specs.js.autogenerated', '*.spec.js')
        .then(function (entryFilePath) {
            return bundle(entryFilePath, destDir.path('specs.js.autogenerated'), {
                rollupPlugins: [
                    istanbul({
                        exclude: ['**/*.spec.js', '**/specs.js.autogenerated'],
                        sourceMap: true
                    })
                ]
            });
        });
});

gulp.task('build-e2e', ['build'], function () {
    var srcDir = jetpack.cwd('e2e');
    var destDir = jetpack.cwd('app');

    return generateEntryFile(srcDir, 'e2e.js.autogenerated', '*.e2e.js')
        .then(function (entryFilePath) {
            return bundle(entryFilePath, destDir.path('e2e.js.autogenerated'));
        });
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

gulp.task('test:e2e', ['pree2e', 'webdriver_update'], () => {
    gulp.src('e2e/**/*.spec.js')
        .pipe(protractor({
            configFile: 'protractor.conf.js',
        }))
        .on('error', e => {
            throw e
        })
        .on('end', () => {
            process.exit()
        });
});

gulp.task('pree2e', done => {
    if (os.platform() === 'darwin') {
        runSequence(
            'package-mac:e2e',
            done
        );
    } else if (os.platform() === 'win32') {
        runSequence(
            'package-win:e2e',
            done
        );
    } else if (os.platform() === 'linux') {
        runSequence(
            'package-linux:e2e',
            done
        );
    }
});
