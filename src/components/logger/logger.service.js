import rx from 'rx-angular';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';
const fs = Promise.promisifyAll(fsExtra);
import path from 'path';
import winston from 'winston';
import chokidar from 'chokidar';
import { Tail } from 'tail';
import readline from 'readline';

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
                            json: false,
                            maxSize: 1000000,
                            maxFiles: 10,
                            timestamp: () => new Date().toISOString(),
                            formatter: function(options) {
                                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
                                (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                            }
                        }),
                        new(winston.transports.File)({
                            name: 'warn-file',
                            filename: path.join(this.logsPath, 'warnings.log'),
                            level: 'warn',
                            tailable: true,
                            json: false,
                            maxSize: 1000000,
                            maxFiles: 10,
                            timestamp: () => new Date().toISOString(),
                            formatter: function(options) {
                                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
                                (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                            }
                        }),
                        new(winston.transports.File)({
                            name: 'error-file',
                            filename: path.join(this.logsPath, 'errors.log'),
                            level: 'error',
                            tailable: true,
                            json: false,
                            maxSize: 1000000,
                            maxFiles: 10,
                            timestamp: () => new Date().toISOString(),
                            formatter: function(options) {
                                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
                                (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                            }
                        }),
                        new(winston.transports.File)({
                            name: 'debug-file',
                            filename: path.join(this.logsPath, 'debug.log'),
                            level: 'debug',
                            tailable: true,
                            json: false,
                            maxSize: 1000000,
                            maxFiles: 10,
                            timestamp: () => new Date().toISOString(),
                            formatter: function(options) {
                                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
                                (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                            }
                        })
                    ]
                });
                return this.initLogsWatcher();
            })
            .then(() => this.getLogs())
            .then(logs => {
                this.logsTail = logs;
                return this.$q.resolve();
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
        return fs.truncateAsync(path.join(this.logsPath, `${logLevel}.log`), 0)
            .then(() => {
                this.logsTail[logLevel] = [];
                return this.$q.resolve();
            });
    }

    clearAll() {
        return fs.truncateAsync(path.join(this.logsPath, `errors.log`), 0)
            .then(() => {
                this.logsTail.errors = [];
                return this.$q.resolve();
            })
            .then(() => fs.truncateAsync(path.join(this.logsPath, `warnings.log`), 0))
            .then(() => {
                this.logsTail.warnings = [];
                return this.$q.resolve();
            })
            .then(() => fs.truncateAsync(path.join(this.logsPath, `info.log`), 0))
            .then(() => {
                this.logsTail.info = [];
                return this.$q.resolve();
            })
            .then(() => fs.truncateAsync(path.join(this.logsPath, `debug.log`), 0))
            .then(() => {
                this.logsTail.debug = [];
                return this.$q.resolve();
            });
    }

    getLogs() {
        if (this.logsTail) return this.$q.resolve(this.logsTail);
        else return this.$q.all({
            errors: this.getErrorLogs(),
            warnings: this.getWarningLogs(),
            info: this.getInfoLogs(),
            debug: this.getDebugLogs()
        });
        // this.logger.query({ order: 'desc' }, (err, results) => {
        //     if (err) reject(err);
        //     angular.forEach(results, (logs, transport) => {
        //         angular.forEach(logs.reverse(), log => {
        //             if (transport === 'error-file' && log.level === 'error' && !this.logsTail.errors.find(msg => msg === log.message)) this.logsTail.errors.push(log.message);
        //             if (transport === 'warn-file' && log.level === 'warn' && !this.logsTail.warnings.find(msg => msg === log.message)) this.logsTail.warnings.push(log.message);
        //             if (transport === 'info-file' && log.level === 'info' && !this.logsTail.info.find(msg => msg === log.message)) this.logsTail.info.push(log.message);
        //             if (transport === 'debug-file' && log.level === 'debug' && !this.logsTail.debug.find(msg => msg === log.message)) this.logsTail.debug.push(log.message);
        //         });
        //     });
        //     resolve(this.logsTail);
        // });
    }

    getErrorLogs() {
        return this.$q((resolve) => {
            let errors = [];
            readline.createInterface({
                input: fs.createReadStream(path.join(this.logsPath, `errors.log`))
            }).on('line', (line) => {
                if (line !== '' && !errors.find(msg => msg === line)) errors.push(line);
            }).on('close', () => {
                return resolve(errors.reverse());
            });
        });
    }

    getWarningLogs() {
        return this.$q((resolve) => {
            let warnings = [];
            readline.createInterface({
                input: fs.createReadStream(path.join(this.logsPath, `warnings.log`))
            }).on('line', (line) => {
                if (line !== '' && !warnings.find(msg => msg === line)) warnings.push(line);
            }).on('close', () => {
                return resolve(warnings.reverse());
            });
        });
    }

    getInfoLogs() {
        return this.$q((resolve) => {
            let info = [];
            readline.createInterface({
                input: fs.createReadStream(path.join(this.logsPath, `info.log`))
            }).on('line', (line) => {
                if (line !== '' && !info.find(msg => msg === line)) info.push(line);
            }).on('close', () => {
                return resolve(info.reverse());
            });
        });
    }

    getDebugLogs() {
        return this.$q((resolve) => {
            let debug = [];
            readline.createInterface({
                input: fs.createReadStream(path.join(this.logsPath, `debug.log`))
            }).on('line', (line) => {
                if (line !== '' && !debug.find(msg => msg === line)) debug.push(line);
            }).on('close', () => {
                return resolve(debug.reverse());
            });
        });
    }

    tail() {
        return rx.Observable.create(observable => {
            const errorTail = new Tail(path.join(this.logsPath, `errors.log`), { fromBeginning: true });
            errorTail.on("line", data => {
                if (data !== '' && !this.logsTail.errors.find(msg => msg === data)) {
                    this.logsTail.errors.unshift(data);
                    observable.onNext(this.logsTail);
                }
            });
            const warningTail = new Tail(path.join(this.logsPath, `warnings.log`), { fromBeginning: true });
            warningTail.on("line", data => {
                if (data !== '' && !this.logsTail.warnings.find(msg => msg === data)) {
                    this.logsTail.warnings.unshift(data);
                    observable.onNext(this.logsTail);
                }
            });
            const infoTail = new Tail(path.join(this.logsPath, `info.log`), { fromBeginning: true });
            infoTail.on("line", data => {
                if (data !== '' && !this.logsTail.info.find(msg => msg === data)) {
                    this.logsTail.info.unshift(data);
                    observable.onNext(this.logsTail);
                }
            });
            const debugTail = new Tail(path.join(this.logsPath, `debug.log`), { fromBeginning: true });
            debugTail.on("line", data => {
                if (data !== '' && !this.logsTail.debug.find(msg => msg === data)) {
                    this.logsTail.debug.unshift(data);
                    observable.onNext(this.logsTail);
                }
            });
            return rx.Disposable.create(() => {
                console.log('disposed');
                errorTail.unwatch();
                warningTail.unwatch();
                infoTail.unwatch();
                if (debugTail) debugTail.unwatch();
            });
        });
    }

    subscribe(o) {
        return this.subject.subscribe(o);
    }
}
