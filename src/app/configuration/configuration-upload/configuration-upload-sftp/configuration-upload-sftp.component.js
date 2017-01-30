class ConfigurationUploadSftpController {
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

export const ConfigurationUploadSftpComponent = {
    bindings: {},
    template: require('./configuration-upload-sftp.html'),
    controller: ConfigurationUploadSftpController
};