import rx from 'rx-angular';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';
const fs = Promise.promisifyAll(fsExtra);
import path from 'path';
import winston from 'winston';
import { spawn } from 'child_process';
import chokidar from 'chokidar';

export class Logger {

    /*@ngInject*/
    constructor($q, configPath, logsPath) {
        this.$q = $q;
        this.logs = {
            errors: {},
            warnings: {},
            info: {},
            debug: {}
        };
        this.subject = new rx.Subject();
        this.configPath = configPath;
        this.logsPath = path.join(__dirname, configPath, logsPath);
        this.initLogger();
    }

    initLogger() {
        fs.ensureFileAsync(path.join(this.logsPath, 'errors.log'))
            .then(() => fs.ensureFileAsync(path.join(this.logsPath, 'warnings.log')))
            .then(() => fs.ensureFileAsync(path.join(this.logsPath, 'info.log')))
            .then(() => fs.ensureFileAsync(path.join(this.logsPath, 'debug.log')))
            .then(() => {
                this.logger = new(winston.Logger)({
                    transports: [
                        new(winston.transports.File)({
                            name: 'info-file',
                            filename: path.join(this.logsPath, 'info.log'),
                            level: 'info'
                        }),
                        new(winston.transports.File)({
                            name: 'warn-file',
                            filename: path.join(this.logsPath, 'warnings.log'),
                            level: 'warn'
                        }),
                        new(winston.transports.File)({
                            name: 'error-file',
                            filename: path.join(this.logsPath, 'errors.log'),
                            level: 'error'
                        }),
                        new(winston.transports.File)({
                            name: 'debug-file',
                            filename: path.join(this.logsPath, 'debug.log'),
                            level: 'debug'
                        }),
                        new(winston.transports.Console)({
                            name: 'debug-console',
                            level: 'debug'
                        })
                    ]
                });
                this.initLogsWatcher();
            })
            .catch(console.warn);
    }

    initLogsWatcher() {
        this.logsWatcher = chokidar.watch(this.logsPath, {})
            .on('change', (filePath, stats) => {
                if (path.basename(filePath) === 'errors.log') {
                    this.logs.errors = {
                        size: stats.size
                    };
                } else if (path.basename(filePath) === 'warnings.log') {
                    this.logs.warnings = {
                        size: stats.size
                    };
                } else if (path.basename(filePath) === 'info.log') {
                    this.logs.info = {
                        size: stats.size
                    };
                } else if (path.basename(filePath) === 'debug.log') {
                    this.logs.debug = {
                        size: stats.size
                    };
                }
                this.subject.onNext(this.logs);
            });
    }

    info(log) {
        this.logger.info(log);
    }

    warn(log) {
        this.logger.warn(log);
    }

    error(log) {
        this.logger.error(log);
    }

    debug(log) {
        this.logger.debug(log);
    }

    clear(logLevel) {
        return fs.truncateAsync(path.join(this.logsPath, `${logLevel}.log`), 0);
    }

    clearAll() {
        return fs.truncateAsync(path.join(this.logsPath, `errors.log`), 0)
            .then(() => fs.truncateAsync(path.join(this.logsPath, `warnings.log`), 0))
            .then(() => fs.truncateAsync(path.join(this.logsPath, `info.log`), 0))
            .then(() => fs.truncateAsync(path.join(this.logsPath, `debug.log`), 0));
    }

    subscribe(o) {
        return this.subject.subscribe(o);
    }
}