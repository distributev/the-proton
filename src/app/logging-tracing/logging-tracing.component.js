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
        this.JobService.getJobs()
            .then(jobs => {
                this.currentJobs = jobs;
                this.observables.push(this.LoggerService.tail().subscribe(logsTail => {
                    this.logs.errors.concat(logsTail.errors);
                    this.logs.warnings.concat(logsTail.warnings);
                    this.logs.info.concat(logsTail.info);
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
            .then(() => this.logs.info = [])
            .catch(console.warn);
    }

    clearWarningLogs() {
        this.LoggerService.clear('warnings')
            .then(() => this.logs.warnings = [])
            .catch(console.warn);
    }

    clearErrorLogs() {
        this.LoggerService.clear('errors')
            .then(() => this.logs.errors = [])
            .catch(console.warn);
    }

    clearAllLogs() {
        this.LoggerService.clearAll()
            .then(() => {
                this.logs.info = [];
                this.logs.warnings = [];
                this.logs.errors = [];
            });
    }
}

export const LoggingTracingComponent = {
    bindings: {
        logs: '<'
    },
    template: require('./logging-tracing.html'),
    controller: LoggingTracingController
};
