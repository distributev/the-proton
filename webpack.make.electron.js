'use strict';
/*eslint-env node*/

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var fs = require('fs');
var path = require('path');

module.exports = function makeWebpackConfig(options) {

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    config.entry = ['./src/background'];

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
        //   'require("source-map-support").install();',
        //   { raw: true, entryOnly: false }
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
