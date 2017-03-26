import chokidar from 'chokidar';

export class FooterController {
    constructor($interval, $timeout, JobService, LoggerService) {
        'ngInject'
        this.$interval = $interval;
        this.$timeout = $timeout;
        this.JobService = JobService;
        this.LoggerService = LoggerService;
    }

    $onInit() {
        this.progress = 0;
        this.activeJobs = [];
        this.initJobsWatcher();
        this.initLogsWatcher();
    }

    $onDestroy() {
        this.jobsSubscription.dispose();
    }

    initJobsWatcher() {
        let stopProgress;
        this.jobsSubscription = this.JobService.subscribe(jobs => {
            this.$timeout(() => {
                this.activeJobs = jobs;
                if (jobs.length) {
                    stopProgress = this.$interval(() => {
                        if (this.progress < 100) {
                            this.progress += 20;
                        } else {
                            this.progress = 0;
                        }
                    }, 1000);
                } else {
                    this.progress = 0;
                    this.$interval.cancel(stopProgress);
                }
            });
        });
    }

    initLogsWatcher() {
        this.logsSubscription = this.LoggerService.subscribe(logs => {
            this.$timeout(() => {
                this.errors = logs.errors.size ? true : false;
                this.warnings = logs.warnings.size ? true : false;
                if (logs.warnings.size || logs.errors.size) {
                    console.log('warning or error', logs);
                }
            });
        });
    }
}

export const FooterComponent = {
    template: require('./footer.html'),
    controller: FooterController
};