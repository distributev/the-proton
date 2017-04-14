import rx from 'rx-angular';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';
const fs = Promise.promisifyAll(fsExtra);
import path from 'path';
import { spawn } from 'child_process';
import chokidar from 'chokidar';
import moment from 'moment';

export class Job {

    /*@ngInject*/
    constructor($http, $q, LoggerService, configPath, tempPath) {
        this.$http = $http;
        this.$q = $q;
        this.LoggerService = LoggerService;
        this.currentState = {};
        this.subject = new rx.Subject();
        this.configPath = configPath
        this.tempPath = path.join(__dirname, this.configPath, tempPath);
        this.getJobs()
            .then(jobs => {
                this.jobs = jobs;
            });
        this.initJobsWatcher();
    }

    initJobsWatcher() {
        this.jobsWatcher = chokidar.watch(this.tempPath, {})
            .on('add', path => {
                console.log(`Added job: ${path}`);
                this.subject.onNext(this.jobs);

            })
            .on('unlink', path => {
                console.log(`Removed job: ${path}`);
                this.subject.onNext(this.jobs);
            });
    }

    getJobs() {
        if (typeof this.jobs === 'undefined') {
            return fs.ensureDirAsync(this.tempPath)
                .then(() => fs.readdirAsync(this.tempPath))
                .then(files => {
                    let promises = [];
                    for (let filename of files) {
                        promises.push(fs.readJsonAsync(path.join(this.tempPath, filename)));
                    }
                    return this.$q.all(promises);
                });
        }
        return this.$q.resolve(this.jobs);
    }

    createJob(job) {
        job.id = moment().valueOf();
        job.submitted = moment(job.id).format('L LTS');
        job.status = 'Runing. Please wait.';
        job.filePath = path.join(this.tempPath, `${job.documentName}_${job.type}_${job.id}.job`);
        return fs.outputFileAsync(job.filePath, JSON.stringify(job)).then(() => job);
    }

    removeJob(job) {
        this.jobs.splice(this.jobs.findIndex(o => o.id === job.id), 1);
        return fs.removeAsync(job.filePath).then(() => job);
    }

    runJob(job) {
        this.jobs.push(job);

        const external = spawn(job.command, job.args);

        external.stdout.on('data', (data) => {
            if (data.toString().includes('warn:')) {
                this.LoggerService.warn(data.toString().substr(6));
            } else if (data.toString().includes('info:')) {
                this.LoggerService.info(data.toString().substr(6));
            } else {
                this.LoggerService.info(data.toString());
            }
        });

        external.stderr.on('data', (data) => {
            this.LoggerService.error(data.toString());
            if (data.toString().includes('error:')) {
                this.LoggerService.error(data.toString().substr(8));
            } else {
                this.LoggerService.info(data.toString());
            }
        });

        external.on('close', (code) => {
            this.LoggerService.debug(`Job ${job.id} finished with exit code ${code}`);
            this.removeJob(job);
        });
        return this.$q.resolve(job);
    }

    subscribe(o) {
        return this.subject.subscribe(o);
    }
}
