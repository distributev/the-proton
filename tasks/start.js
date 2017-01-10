'use strict';

import childProcess from 'child_process';
import gulp from 'gulp';
import electron from 'electron';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './../webpack.dev';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const port = process.env.port || 3000;

gulp.task('start', ['environment'], () => {
    let compiler = webpack(webpackConfig);
    let server = new WebpackDevServer(compiler, {
        contentBase: 'src',
        hot: true,
        filename: webpackConfig.output.filename,
        publicPath: '/',
        stats: {
            colors: true,
        }
    });
    server.listen(3000, 'localhost', () => {
        childProcess.spawn(electron, ['-r', 'babel-register', './src'], {
                stdio: 'inherit'
            })
            .on('close', () => {
                // User closed the app. Kill the host process.
                process.exit();
            });
    });
});

gulp.task('start:hot', () => {
    const config = webpackConfig;
    const app = express();
    const compiler = webpack(config);

    const wdm = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        reload: true,
        stats: {
            colors: true
        }
    });

    app.use(wdm);

    app.use(webpackHotMiddleware(compiler));

    const server = app.listen(port, 'localhost', serverError => {
        if (serverError) {
            return console.error(serverError);
        }

        // if (argv['start-hot']) {
        childProcess.spawn('npm', ['run', 'start-hot'], { shell: true, env: process.env, stdio: 'inherit' })
            .on('close', code => process.exit(code))
            .on('error', spawnError => console.error(spawnError));
        // }

        console.log(`Listening at http://localhost:${port}`);
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