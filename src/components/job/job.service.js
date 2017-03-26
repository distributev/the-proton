import rx from 'rx-angular';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';
const fs = Promise.promisifyAll(fsExtra);
import path from 'path';
import { spawn } from 'child_process';
import chokidar from 'chokidar';

export class Job {

    /*@ngInject*/
    constructor($http, $q, LoggerService, configPath, tempPath) {
        this.$http = $http;
        this.$q = $q;
        this.LoggerService = LoggerService;
        this.currentState = {};
        this.subject = new rx.Subject();
        this.configPath = configPath
        this.tempPath = tempPath;
        this.getJobs()
            .then(jobs => {
                console.log(jobs);
                this.jobs = jobs;
            });
        // this.jobs = [];
        this.initJobsWatcher();
    }

    initJobsWatcher() {
        this.jobsWatcher = chokidar.watch(path.join(__dirname, this.configPath, this.tempPath), {})
            .on('add', path => {
                console.warn(`Added job: ${path}`);
                this.subject.onNext(this.jobs);

            })
            .on('unlink', path => {
                console.warn(`Removed job: ${path}`);
                this.subject.onNext(this.jobs);
            });
    }

    getJobs() {
        if (typeof this.jobs === 'undefined') {
            return fs.readdirAsync(path.join(__dirname, this.configPath, this.tempPath))
                .then(files => {
                    let promises = [];
                    for (let filename of files) {
                        promises.push(fsExtra.readJsonAsync(path.join(__dirname, this.configPath, this.tempPath, filename)));
                    }
                    return this.$q.all(promises);
                });
        }
        return this.$q.resolve(this.jobs);
    }

    createJob(job) {
        job.id = Date.now();
        job.submitted = new Date(job.id * 1000).toLocaleString();
        job.status = 'Runing. Please wait.';
        job.filePath = path.join(__dirname, this.configPath, this.tempPath, `${job.documentName}_${job.type}_${job.id}.job`);
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
            console.log(`stdout: ${data.toString()}`);
            if (data.toString().startsWith('warn:')) {
                this.LoggerService.warn(data.toString().substr(6));
            } else if (data.toString().startsWith('info:')) {
                this.LoggerService.info(data.toString().substr(6));
            } else {
                this.LoggerService.info(data.toString());
            }
        });

        external.stderr.on('data', (data) => {
            console.log(`stderr: ${data.toString()}`);
            this.LoggerService.error(data.toString());
            if (data.toString().startsWith('error:')) {
                this.LoggerService.error(data.toString().substr(8));
            } else {
                this.LoggerService.info(data.toString());
            }
        });

        external.on('close', (code) => {
            console.log(`Job ${job.id} finished with exit code ${code}`);
            this.LoggerService.debug(`Job ${job.id} finished with exit code ${code}`);
            this.removeJob(job);
        });
        return this.$q.resolve(job);
    }

    subscribe(o) {
        return this.subject.subscribe(o);
    }
}