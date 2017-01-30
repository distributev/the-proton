class LoggingTracingController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {}

    $onChanges(changes) {}

    getCurrentJobs() {
        return [{
                name: 'document.pdf',
                jobType: 'test',
                status: 'Running. Please wait.',
                submmited: '21/12/2016 09:37:37',
                timeElapsed: '20 min'
            },
            {
                name: 'document.pdf',
                jobType: 'test',
                status: 'Running. Please wait.',
                submmited: '21/12/2016 09:37:37',
                timeElapsed: '20 min'
            },
            {
                name: 'document.pdf',
                jobType: 'test',
                status: 'Running. Please wait.',
                submmited: '21/12/2016 09:37:37',
                timeElapsed: '20 min'
            },
            {
                name: 'document.pdf',
                jobType: 'test',
                status: 'Running. Please wait.',
                submmited: '21/12/2016 09:37:37',
                timeElapsed: '20 min'
            }
        ];
    }

    getInfoLogs() {

    }

    getWarningLogs() {

    }

    getErrorLogs() {

    }
}

export const LoggingTracingComponent = {
    bindings: {},
    template: require('./logging-tracing.html'),
    controller: LoggingTracingController
};