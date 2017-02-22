'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import less from 'gulp-less';
import watch from 'gulp-watch';
import batch from 'gulp-batch';
import plumber from 'gulp-plumber';
import jetpack from 'fs-jetpack';
import del from 'del';
import electronConnect from 'electron-connect';
let electron = electronConnect.server.create({ stopOnClose: true });
import utils from './utils';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import packageConfig from '../package.json';
import gulpNgConfig from 'gulp-ng-config';

let projectDir = jetpack;
let srcDir = jetpack.cwd('./src');
let destDir = () => {
    return utils.getEnvName() === 'development' ? jetpack.cwd('./src') : jetpack.cwd('./dist');
}

let mainStylePath = srcDir.path('app/app.less');
let stylesPath = [srcDir.path('{app,components}/**/*.less')];

let plugins = gulpLoadPlugins();

gulp.task('clean:dist', () => del(['dist/**/*', '!dist/.gitkeep'], { dot: true }));

gulp.task('inject', cb => {
    runSequence(['inject:less'], cb);
});

gulp.task('inject:less', () => {
    return gulp.src(mainStylePath)
        .pipe(plugins.inject(
            gulp.src(_.union(stylesPath, ['!' + mainStylePath]), { read: false })
            .pipe(plugins.sort()), {
                transform: (filepath) => {
                    let newPath = filepath
                        .replace(`/src/app/`, '')
                        .replace(`/src/components/`, '../components/')
                        .replace(/_(.*).less/, (match, p1, offset, string) => p1)
                        .replace('.less', '');
                    return `@import '${newPath}';`;
                }
            }))
        .pipe(gulp.dest(`src/app`));
});

gulp.task('env:prod', () => {
    return process.env.NODE_ENV = 'production';
});

gulp.task('environment', () => {
    let configFile = 'config/environment/' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir().path('env.json'), { overwrite: true });
});

gulp.task('ngEnvConfig', ['environment'], function() {
    gulp.src(destDir().path('env.json'))
        .pipe(gulpNgConfig(`theProtonApp.environment`, { createModule: true, wrap: 'ES6' }))
        .pipe(gulp.dest(srcDir.path('components/config/')))
});

gulp.task('copy:fonts:dev', () => {
    return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(utils.flatten())
        .pipe(gulp.dest(`src/assets/fonts`));
});

gulp.task('copy:fonts', () => {
    return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(utils.flatten())
        .pipe(gulp.dest(`dist/assets/fonts`));
});

gulp.task('copy:assets', () => {
    return gulp.src([srcDir.path('assets/**/*')])
        .pipe(gulp.dest(destDir().path('assets')));
});

gulp.task('copy:extras', () => {
    return gulp.src([
            srcDir.path('favicon.ico'),
            srcDir.path('robots.txt'),
            srcDir.path('.htaccess'),
            srcDir.path('index.html'),
            srcDir.path('package.json')
        ], { dot: true })
        .pipe(gulp.dest(destDir().path()));
});

gulp.task('copy:templates', () => {
    return gulp.src(['templates/**/*'])
        .pipe(gulp.dest(destDir().path('templates')));
});

gulp.task('watch', () => {
    let beepOnError = (done) => {
        return (err) => {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch('src/background.js', batch((events, done) => {
        runSequence(
            'webpack:main:dev',
            'reload:browser',
            beepOnError(done)
        )
    }));
    watch(['src/**/*.{js,html,less}', '!src/background.js', '!src/index.html'], batch((events, done) => {
        runSequence(
            'webpack:dev',
            'reload:renderer',
            beepOnError(done)
        )
    }));
});

gulp.task('reload:browser', done => {
    // Restart Electron's main process
    electron.restart();
    done();
});

gulp.task('reload:renderer', done => {
    // Reload Electron's renderer process
    electron.reload();
    done();
});

gulp.task('bundle', ['webpack:main', 'webpack:dist']);

gulp.task('build', done => {
    runSequence(
        'clean:dist',
        'inject',
        'ngEnvConfig',
        'copy:assets',
        'copy:fonts',
        'copy:extras',
        'bundle',
        'copy:templates',
        done
    );
});

gulp.task('build:prod', done => {
    runSequence(
        'env:prod',
        'build',
        done
    );
});