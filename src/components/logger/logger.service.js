import rx from 'rx-angular';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';
const fs = Promise.promisifyAll(fsExtra);
import path from 'path';
import winston from 'winston';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import moment from 'moment';

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
        // this.initLogger();
    }

    initLogger() {
        return fs.ensureFileAsync(path.join(this.logsPath, 'errors.log'))
            .then(() => fs.ensureFileAsync(path.join(this.logsPath, 'warnings.log')))
            .then(() => fs.ensureFileAsync(path.join(this.logsPath, 'info.log')))
            .then(() => fs.ensureFileAsync(path.join(this.logsPath, 'debug.log')))
            .then(() => {
                this.logger = new(winston.Logger)({
                    transports: [
                        new(winston.transports.File)({
                            name: 'info-file',
                            filename: path.join(this.logsPath, 'info.log'),
                            level: 'info',
                            tailable: true,
                            maxSize: 1000000,
                            maxFiles: 10,
                            timestamp: () => new Date().toISOString()
                        }),
                        new(winston.transports.File)({
                            name: 'warn-file',
                            filename: path.join(this.logsPath, 'warnings.log'),
                            level: 'warn',
                            tailable: true,
                            maxSize: 1000000,
                            maxFiles: 10,
                            timestamp: () => new Date().toISOString()
                        }),
                        new(winston.transports.File)({
                            name: 'error-file',
                            filename: path.join(this.logsPath, 'errors.log'),
                            level: 'error',
                            tailable: true,
                            maxSize: 1000000,
                            maxFiles: 10,
                            timestamp: () => new Date().toISOString()
                        }),
                        new(winston.transports.File)({
                            name: 'debug-file',
                            filename: path.join(this.logsPath, 'debug.log'),
                            level: 'debug',
                            tailable: true,
                            maxSize: 1000000,
                            maxFiles: 10,
                            timestamp: () => new Date().toISOString()
                        })
                    ]
                });
                return this.initLogsWatcher();
            });
    }

    initLogsWatcher() {
        return fs.statAsync(path.join(this.logsPath, 'errors.log'))
            .then(stats => {
                this.logs.errors = {
                    size: stats.size
                };
                return fs.statAsync(path.join(this.logsPath, 'warnings.log'))
            })
            .then(stats => {
                this.logs.warnings = {
                    size: stats.size
                };
                return fs.statAsync(path.join(this.logsPath, 'info.log'))
            })
            .then(stats => {
                this.logs.info = {
                    size: stats.size
                };
                return fs.statAsync(path.join(this.logsPath, 'debug.log'))
            })
            .then(stats => {
                this.logs.debug = {
                    size: stats.size
                };
                this.subject.onNext(this.logs);

                this.logsWatcher = chokidar.watch(this.logsPath, { usePolling: true })
                    .on('change', (filePath, stats) => {
                        if (stats) {
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
                        }
                    });
                return this.$q.resolve();
            });
    }

    info(log) {
        this.logger.info(`[${new Date().toISOString()}] INFO: ${log}`);
    }

    warn(log) {
        this.logger.warn(`[${new Date().toISOString()}] WARNING: ${log}`);
    }

    error(log) {
        this.logger.error(`[${new Date().toISOString()}] ERROR: ${log}`);
    }

    debug(log) {
        this.logger.debug(`[${new Date().toISOString()}] DEBUG: ${log}`);
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

    tail(size) {
        var options = {
            limit: size,
            order: 'desc'
        };

        return rx.Observable.create(observable => {
            this.logger.query(options, (err, results) => {
                if (err) observable.onError(err);
                this.logsTail = {
                    errors: [],
                    warnings: [],
                    info: [],
                    debug: []
                };
                angular.forEach(results, (logs, transport) => {
                    angular.forEach(logs.reverse(), log => {
                        if (transport === 'error-file' && log.level === 'error' && !this.logsTail.errors.find(msg => msg === log.message)) this.logsTail.errors.push(log.message);
                        if (transport === 'warn-file' && log.level === 'warn' && !this.logsTail.warnings.find(msg => msg === log.message)) this.logsTail.warnings.push(log.message);
                        if (transport === 'info-file' && log.level === 'info' && !this.logsTail.info.find(msg => msg === log.message)) this.logsTail.info.push(log.message);
                        if (transport === 'debug-file' && log.level === 'debug' && !this.logsTail.debug.find(msg => msg === log.message)) this.logsTail.debug.push(log.message);
                    });
                });
                observable.onNext(this.logsTail);
                this.logger.on('logging', (transport, level, message, meta) => {
                    if (transport.name === 'error-file' && level === 'error' && !this.logsTail.errors.find(msg => msg === message)) this.logsTail.errors.push(message);
                    if (transport.name === 'warn-file' && level === 'warn' && !this.logsTail.warnings.find(msg => msg === message)) this.logsTail.warnings.push(message);
                    if (transport.name === 'info-file' && level === 'info' && !this.logsTail.info.find(msg => msg === message)) this.logsTail.info.push(message);
                    if (transport.name === 'debug-file' && level === 'debug' && !this.logsTail.debug.find(msg => msg === message)) this.logsTail.debug.push(message);
                    observable.onNext(this.logsTail);
                });
            });
        });
    }

    subscribe(o) {
        return this.subject.subscribe(o);
    }
}
