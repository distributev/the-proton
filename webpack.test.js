/**
 * Webpack config for tests
 */
import makeWebpackConfig from './webpack.make';

export default (options) =>  {
    return makeWebpackConfig({
        BUILD: false,
        TEST: true,
        DEV: false
    });
};