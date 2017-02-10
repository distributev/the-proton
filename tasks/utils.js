import through2 from 'through2';
import path from 'path';
let argv = require('minimist')(process.argv);

exports.getEnvName = () => {
    return argv.env || process.env.NODE_ENV || 'development';
};

exports.beepSound = () => {
    process.stdout.write('\u0007');
};

exports.flatten = () => {
    return through2.obj(function(file, enc, next) {
        if (!file.isDirectory()) {
            try {
                let dir = path.dirname(file.relative).split(path.sep)[0];
                let fileName = path.normalize(path.basename(file.path));
                file.path = path.join(file.base, path.join(dir, fileName));
                this.push(file);
            } catch (e) {
                this.emit('error', new Error(e));
            }
        }
        next();
    });
}