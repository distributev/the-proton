const LOG_SAMPLE = `
        [07/Mar/2004:16:30:29 -0800] "GET /twiki/bin/attach/Main/OfficeLocations HTTP/1.1" 401 12851
        [07/Mar/2004:16:31:48 -0800] "GET /twiki/bin/view/TWiki/WebTopicEditTemplate HTTP/1.1" 200 3732
        [07/Mar/2004:16:32:50 -0800] "GET /twiki/bin/view/Main/WebChanges HTTP/1.1" 200 40520
        [07/Mar/2004:16:33:53 -0800] "GET /twiki/bin/edit/Main/Smtpd_etrn_restrictions?topicparent=Main.ConfigurationVariables HTTP/1.1" 401 12851
        [07/Mar/2004:16:35:19 -0800] "GET /mailman/listinfo/business HTTP/1.1" 200 6379
        [07/Mar/2004:16:36:22 -0800] "GET /twiki/bin/rdiff/Main/WebIndex?rev1=1.2&rev2=1.1 HTTP/1.1" 200 46373
        [07/Mar/2004:16:37:27 -0800] "GET /twiki/bin/view/TWiki/DontNotify HTTP/1.1" 200 4140
        [07/Mar/2004:16:39:24 -0800] "GET /twiki/bin/view/Main/TokyoOffice HTTP/1.1" 200 3853
        [07/Mar/2004:16:43:54 -0800] "GET /twiki/bin/view/Main/MikeMannix HTTP/1.1" 200 3686
        [07/Mar/2004:16:45:56 -0800] "GET /twiki/bin/attach/Main/PostfixCommands HTTP/1.1" 401 12846    
`;
// TODO: replace static sample data with log files data
export class Logging {

    /*@ngInject*/
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    getCurrentJobs() {
        return this.$q.resolve([{
            name: 'document.pdf',
            type: 'test',
            status: 'Running. Please wait.',
            submitted: '21/12/2016 09:37:37',
            timeElapsed: '20 min'
        }]);
    }

    getInfoLogs() {
        return this.$q.resolve(LOG_SAMPLE);
    }

    getWarningLogs() {
        return this.$q.resolve(LOG_SAMPLE);
    }

    getErrorLogs() {
        return this.$q.resolve(LOG_SAMPLE);
    }
}