/**
 * Webpack config for builds
 */
import makeWebpackConfig from './webpack.make';

export default (options) =>  {
    return makeWebpackConfig({
        BUILD: true,
        TEST: false,
        DEV: false
    });
};