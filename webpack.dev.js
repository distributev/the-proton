/**
 * Webpack config for development
 */
import makeWebpackConfig from './webpack.make';

export default (options) =>  {
    return makeWebpackConfig({
        BUILD: false,
        TEST: false,
        DEV: true
    });
};