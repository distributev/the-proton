'use strict';
/*eslint-env node*/
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import fs from 'fs';
import path from 'path';
const componentHotLoader = require.resolve('./node_modules/angular-hot-reloader/loaders/component-loader.js');
const serviceHotLoader = require.resolve('./node_modules/angular-hot-reloader/loaders/service-loader.js');
const jadeHotLoader = require.resolve('./node_modules/angular-hot-reloader/loaders/jade-loader.js');

const port = process.env.PORT || 3000;

export default (options) => {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    const BUILD = !!options.BUILD;
    const TEST = !!options.TEST;
    const E2E = !!options.E2E;
    const DEV = !!options.DEV;

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    let config = {};

    config.target = "electron-renderer";

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if (TEST) {
        config.entry = {};
    } else {
        config.entry = {
            app: [
                'webpack/hot/dev-server',
                `webpack-dev-server/client?http://localhost:${port}`,
                'babel-polyfill',
                './src/app/app.js'
            ],
            polyfills: [
                './src/polyfills.js'
            ],
            vendor: [
                'angular',
                'angular-animate',
                'angular-aria',
                'angular-cookies',
                'angular-resource',

                'angular-sanitize',

                'angular-ui-bootstrap',
                'angular-ui-router',
                'lodash',
                'jquery',
                'jquery-ui',
                'jquery-slimscroll',
                'admin-lte/dist/js/app'
            ]
        };
    }

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    if (TEST) {
        config.output = {};
    } else {
        config.output = {
            // Absolute output directory
            path: BUILD ? path.join(__dirname, '/dist/') : path.join(__dirname, '/src'),

            // Output path from the view of the page
            // Uses webpack-dev-server in development
            publicPath: BUILD || E2E ? '' : `http://localhost:${port}/`,
            //publicPath: BUILD ? '/' : 'http://localhost:' + env.port + '/',

            // Filename for entry points
            // Only adds hash in build mode
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        };
    }



    if (TEST) {
        config.resolve = {
            alias: {
                jqueryUi: 'jquery-ui',
            },
            modulesDirectories: [
                'node_modules'
            ],
            extensions: ['', '.js', '.ts']
        };
    }

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (TEST) {
        config.devtool = 'inline-source-map';
    } else if (BUILD || DEV) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */


    config.babel = {
        shouldPrintComment(commentContents) {
            // keep `/*@ngInject*/`
            return /@ngInject/.test(commentContents);
        }
    }

    // Initialize module
    config.module = {
        preLoaders: [],
        loaders: [{
            // JS LOADER
            // Reference: https://github.com/babel/babel-loader
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            loader: 'babel',
            include: [
                path.resolve(__dirname, 'src/'),
                path.resolve(__dirname, 'node_modules/lodash-es/')
            ]
        }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
            loader: 'file'
        }, {

            // HTML LOADER
            // Reference: https://github.com/webpack/raw-loader
            // Allow loading html through js
            test: /\.html$/,
            loader: 'raw'
        }, {
            // CSS LOADER
            // Reference: https://github.com/webpack/css-loader
            // Allow loading css through js
            //
            // Reference: https://github.com/postcss/postcss-loader
            // Postprocess your css with PostCSS plugins
            test: /\.css$/,
            loader: !TEST
                // Reference: https://github.com/webpack/extract-text-webpack-plugin
                // Extract css files in production builds
                //
                // Reference: https://github.com/webpack/style-loader
                // Use style-loader in development for hot-loading
                ?
                ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
                // Reference: https://github.com/webpack/null-loader
                // Skip loading css in test mode
                :
                'null'
        }, {

            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'

        }, {

            // LESS LOADER
            // Reference: https://github.com/
            test: /\.less$/,
            loaders: ['style', 'css', 'less'],
            include: [
                path.resolve(__dirname, 'node_modules/bootstrap/less/*.less'),
                path.resolve(__dirname, 'src/app/app.less')
            ]

        }]
    };

    config.module.postLoaders = [{
        test: /\.js$/,
        loader: 'ng-annotate?single_quotes'
    }];

    // ISPARTA INSTRUMENTER LOADER
    // Reference: https://github.com/ColCh/isparta-instrumenter-loader
    // Instrument JS files with Isparta for subsequent code coverage reporting
    // Skips node_modules and spec files
    if (TEST) {
        config.module.preLoaders.push({
            //delays coverage til after tests are run, fixing transpiled source coverage error
            test: /\.js$/,
            exclude: /(node_modules|spec\.js|mock\.js)/,
            loader: 'isparta-instrumenter',
            query: {
                babel: {
                    // optional: ['runtime', 'es7.classProperties', 'es7.decorators']
                }
            }
        });
    }

    config.module.preLoaders.push({ test: /\.component\.js$/, loader: componentHotLoader, exclude: [/client\/lib/, /node_modules/, /\.spec\.js/, /components\/themes/] });
    config.module.preLoaders.push({ test: /\.service\.js$/, loader: serviceHotLoader, exclude: [/client\/lib/, /node_modules/, /\.spec\.js/, /components\/themes/] })
    config.module.postLoaders.push({ test: /\.html/, loader: jadeHotLoader, exclude: [/components\/themes/] });

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin('[name].[hash].css', {
            disable: !BUILD || TEST
        }),

        new webpack.ProvidePlugin({
            '$': "jquery",
            'window.jQuery': "jquery",
            'jQuery': 'jquery',
            'window.$': 'jquery',
            'jquery': 'jquery'
        })
    ];

    if (!TEST) {
        config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',

            // filename: "vendor.js"
            // (Give the chunk a different name)

            minChunks: Infinity
                // (with more entries, this ensures that no other module
                //  goes into the vendor chunk)
        }));
    }

    // Skip rendering index.html in test mode
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    let htmlConfig = {
        template: 'src/_index.ejs',
        filename: '../src/index.html',
        alwaysWriteToDisk: true
    }
    config.plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(htmlConfig),
        new HtmlWebpackHarddiskPlugin()
    );

    // Add build specific plugins
    if (BUILD) {
        config.plugins.push(

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }),

            // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
            // Define free global variables
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })
        );
    }

    if (DEV) {
        config.plugins.push(
            // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
            // Define free global variables
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            })
        );
    }

    config.cache = DEV;

    if (TEST) {
        config.stats = {
            colors: true,
            reasons: true
        };
        config.debug = false;
    }

    config.node = {
        __dirname: false,
        __filename: false,
        global: 'window'
    };

    return config;
};