'use strict';

import childProcess from 'child_process';
import gulp from 'gulp';
import path from 'path';
import electron from 'electron';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './../webpack.dev';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import gutil from 'gulp-util';

const port = process.env.port || 3000;

gulp.task('start', ['clean:config', 'ngEnvConfig', 'copy:fonts:dev', 'inject'], () => {
    let initialCompile = true;
    let compiler = webpack(webpackConfig);
    gutil.log('Webpack Build Started...');
    let server = new WebpackDevServer(compiler, {
        contentBase: webpackConfig.output.path,
        hot: true,
        reload: true,
        historyApiFallback: true,
        filename: webpackConfig.output.filename,
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
        }
    });
    compiler.plugin('done', function() {
        if (initialCompile) {
            initialCompile = false;
            gutil.log('Webpack Build Done!');
            server.listen(port, 'localhost', () => {
                childProcess.spawn(electron, ['-r', 'babel-register', './src'], {
                        stdio: 'inherit'
                    })
                    .on('close', () => {
                        // User closed the app. Kill the host process.
                        process.exit();
                    });
            });
        }
    });
});


gulp.task('start:dist', ['build'], () => {
    childProcess.spawn(electron, ['./dist'], {
            stdio: 'inherit'
        })
        .on('close', () => {
            // User closed the app. Kill the host process.
            process.exit();
        });
});
