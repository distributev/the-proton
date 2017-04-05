const os = require('os');

let binaryPath;

console.log('os.platform', os.platform());
if (os.platform() === 'darwin') {
    binaryPath = './release/mac/TheProtonApp.app/Contents/MacOS/TheProtonApp'
} else if (os.platform() === 'win32') {
    binaryPath = './release/win-ia32-unpacked/TheProtonApp.exe'
} else if (os.platform() === 'linux') {
    binaryPath = './release/linux-ia32-unpacked/theproton'
}

exports.config = {
    framework: 'mocha',

    // directConnect: true,

    specs: ['./e2e/**/*.spec.js'],

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            binary: binaryPath
        }
    },

    // ----- Options to be passed to mocha -----
    mochaOpts: {
        reporter: 'spec',
        timeout: 30000,
        defaultTimeoutInterval: 30000
    },

    onPrepare: function () {
        require('babel-register');
        // Load Mocha and Chai + plugins
        require('./mocha.conf');

        // Expose should assertions (see https://github.com/angular/protractor/issues/633)
        Object.defineProperty(
            protractor.promise.Promise.prototype,
            'should',
            Object.getOwnPropertyDescriptor(Object.prototype, 'should')
        );

        browser.resetUrl = "file://";
    }
};
