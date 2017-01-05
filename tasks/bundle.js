'use strict';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import webpack from 'webpack-stream';
import makeElectronWebpackConfig from './../webpack.make.electron';
import makeWebpackConfig from './../webpack.make';

gulp.task('webpack:main:dev', () => {
    const webpackDevConfig = makeElectronWebpackConfig({ DEV: true });
    return gulp.src(webpackDevConfig.entry)
        .pipe(plumber())
        .pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest('dist'));
});

gulp.task('webpack:dev', () => {
    const webpackDevConfig = makeWebpackConfig({ DEV: true });
    return gulp.src(webpackDevConfig.entry.app)
        .pipe(plumber())
        .pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest('dist'));
});

// gulp.task('webpack:dist', function() {
//     const webpackDistConfig = makeWebpackConfig({ BUILD: true });
//     return gulp.src(webpackDistConfig.entry.app)
//         .pipe(webpack(webpackDistConfig))
//         .on('error', (err) => {
//           this.emit('end'); // Recover from errors
//         })
//         .pipe(gulp.dest(`${paths.dist}/client`));
// });

// gulp.task('webpack:test', function() {
//     const webpackTestConfig = makeWebpackConfig({ TEST: true });
//     return gulp.src(webpackTestConfig.entry.app)
//         .pipe(webpack(webpackTestConfig))
//         .pipe(gulp.dest('.tmp'));
// });

// gulp.task('webpack:e2e', function() {
//     const webpackE2eConfig = makeWebpackConfig({ E2E: true });
//     return gulp.src(webpackE2eConfig.entry.app)
//         .pipe(webpack(webpackE2eConfig))
//         .pipe(gulp.dest('.tmp'));
// });
