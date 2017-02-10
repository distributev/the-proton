'use strict';
/*eslint-env node*/

import webpack from 'webpack';
import path from 'path';

export default (options) => {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    let config = {};

    config.entry = [
        'babel-polyfill',
        './src/background'
    ];

    config.module = {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/
        }]
    };

    config.output = {
        path: path.join(__dirname, 'dist'),
        filename: 'background.js',
    };

    // https://webpack.github.io/docs/configuration.html#resolve
    config.resolve = {
        extensions: ['', '.js', '.jsx', '.json'],
        packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
    };

    config.plugins = [
        // new BabiliPlugin(),
        // Add source map support for stack traces in node
        // https://github.com/evanw/node-source-map-support
        // new webpack.BannerPlugin(
        //     'require("source-map-support").install();', { raw: true, entryOnly: false }
        // ),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ];

    config.externals = {};

    config.target = "electron-main";

    config.devtool = 'source-map';

    // config.module.noParse = ['ws', 'spawn-sync'];
    // config.externals = ['ws', 'spawn-sync'];

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    config.node = {
        __dirname: false,
        __filename: false
    };

    return config;
};