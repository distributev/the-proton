class ConfigurationUploadFtpController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {

    }

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationUploadFtpComponent = {
    bindings: {},
    template: require('./configuration-upload-ftp.html'),
    controller: ConfigurationUploadFtpController
};