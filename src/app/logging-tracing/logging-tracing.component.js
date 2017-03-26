class LoggingTracingController {
    constructor($state, LoggingService, LoggerService, $timeout) {
        'ngInject';
        this.$state = $state;
        this.LoggingService = LoggingService;
        this.LoggerService = LoggerService;
    }

    $onInit() {
        // this.JobService.getJobs()
        //     .then(console.log)
        //     .catch(console.warn);
        this.getCurrentJobs().then(jobs => this.currentJobs = jobs);
        this.getInfoLogs().then(logs => {
            this.infoLogs = logs
        });
        this.getWarningLogs().then(logs => this.warningLogs = logs);
        this.getErrorLogs().then(logs => this.errorLogs = logs);
    }

    $onChanges(changes) {}

    getCurrentJobs() {
        return this.LoggingService.getCurrentJobs();
    }

    getInfoLogs() {
        return this.LoggingService.getInfoLogs();
    }

    getWarningLogs() {
        return this.LoggingService.getWarningLogs();
    }

    getErrorLogs() {
        return this.LoggingService.getErrorLogs();
    }

    clearInfoLogs() {
        this.infoLogs = '';
    }

    clearWarningLogs() {
        this.warningLogs = '';
    }

    clearErrorLogs() {
        this.errorLogs = '';
    }

    clearAllLogs() {

        this.infoLogs = '';
        this.warningLogs = '';
        this.errorLogs = '';
    }
}

export const LoggingTracingComponent = {
    bindings: {},
    template: require('./logging-tracing.html'),
    controller: LoggingTracingController
};