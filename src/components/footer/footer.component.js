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
        this.jobsSubscription = this.JobService.subscribe(jobs => {
            this.$timeout(() => {
                this.activeJobs = jobs || [];
                if (jobs && jobs.length) {
                    this.stopProgress = this.stopProgress ? this.stopProgress : this.$interval(() => {
                        if (this.progress < 100) {
                            this.progress += 20;
                        } else {
                            this.progress = 0;
                        }
                    }, 1000);
                } else {
                    this.progress = 0;
                    this.$interval.cancel(this.stopProgress);
                }
            });
        });
    }

    initLogsWatcher() {
        this.logsSubscription = this.LoggerService.subscribe(logs => {
            this.$timeout(() => {
                this.errors = logs.errors.size ? true : false;
                this.warnings = logs.warnings.size ? true : false;
            });
        });
    }
}

export const FooterComponent = {
    template: require('./footer.html'),
    controller: FooterController
};
