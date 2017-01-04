'use strict';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import del from 'del';
import webpack from 'webpack-stream';
import makeWebpackConfig from './../webpack.make';

// var path = require('path');
// var jetpack = require('fs-jetpack');
// var rollup = require('rollup').rollup;

// var nodeBuiltInModules = ['assert', 'buffer', 'child_process', 'cluster',
//     'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events',
//     'fs', 'http', 'https', 'module', 'net', 'os', 'path', 'process', 'punycode',
//     'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'timers',
//     'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

// var electronBuiltInModules = ['electron'];

// var generateExternalModulesList = function () {
//     var appManifest = jetpack.read('./package.json', 'json');
//     return [].concat(
//         nodeBuiltInModules,
//         electronBuiltInModules,
//         Object.keys(appManifest.dependencies),
//         Object.keys(appManifest.devDependencies)
//     );
// };

// var cached = {};

// module.exports = function (src, dest, opts) {
//     opts = opts || {};
//     opts.rollupPlugins = opts.rollupPlugins || [];
//     return rollup({
//         entry: src,
//         external: generateExternalModulesList(),
//         cache: cached[src],
//         plugins: opts.rollupPlugins,
//     })
//     .then(function (bundle) {
//         cached[src] = bundle;

//         var jsFile = path.basename(dest);
//         var result = bundle.generate({
//             format: 'cjs',
//             sourceMap: true,
//             sourceMapFile: jsFile,
//         });
//         // Wrap code in self invoking function so the variables don't
//         // pollute the global namespace.
//         var isolatedCode = '(function () {' + result.code + '\n}());';
//         return Promise.all([
//             jetpack.writeAsync(dest, isolatedCode + '\n//# sourceMappingURL=' + jsFile + '.map'),
//             jetpack.writeAsync(dest + '.map', result.map.toString()),
//         ]);
//     });
// };

gulp.task('clean:dist', () => del(['dist/**/*'], {dot: true}));

gulp.task('webpack:dev', function() {
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
