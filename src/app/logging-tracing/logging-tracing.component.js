import moment from 'moment';

class LoggingTracingController {
    constructor($state, $interval, LoggerService, JobService, $timeout) {
        'ngInject';
        this.$state = $state;
        this.$interval = $interval;
        this.LoggerService = LoggerService;
        this.JobService = JobService;
    }

    $onInit() {
        this.observables = [];
        this.logTailSize = 10;
        this.JobService.getJobs()
            .then(jobs => {
                this.currentJobs = jobs;
                return this.LoggerService.initLogger();
            })
            .then(() => {
                this.observables.push(this.LoggerService.tail(this.logTailSize).subscribe(logsTail => {
                    this.errorLogs = logsTail.errors;
                    this.warningLogs = logsTail.warnings;
                    this.infoLogs = logsTail.info;
                }));
            })
            .catch(console.warn);
        moment.relativeTimeThreshold('ss', 1);
        this.refreshInterval = this.$interval(() => {
            angular.forEach(this.currentJobs, job => {
                job.elapsed = moment(job.id).fromNow();
            }, 1000);
        });
    }

    $onChanges(changes) {}

    $onDestroy() {
        this.$interval.cancel(this.refreshInterval);
        angular.forEach(this.observables, obs => obs.dispose());
    }

    clearInfoLogs() {
        this.LoggerService.clear('info')
            .then(() => this.infoLogs = [])
            .catch(console.warn);
    }

    clearWarningLogs() {
        this.LoggerService.clear('warnings')
            .then(() => this.warningLogs = [])
            .catch(console.warn);
    }

    clearErrorLogs() {
        this.LoggerService.clear('errors')
            .then(() => this.errorLogs = [])
            .catch(console.warn);
    }

    clearAllLogs() {
        this.LoggerService.clearAll();
    }
}

export const LoggingTracingComponent = {
    bindings: {},
    template: require('./logging-tracing.html'),
    controller: LoggingTracingController
};
