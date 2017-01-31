class ConfigurationUploadSftpController {
    constructor($state, $timeout) {
        'ngInject';
        this.$state = $state;
        this.$timeout = $timeout;
        this.formData = {};
    }

    $onInit() {

    }

    $onChanges(changes) {}

    onSubmit() {

    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.formData[inputModel] = this.formData[inputModel] ? this.formData[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }
}

export const ConfigurationUploadSftpComponent = {
    bindings: {},
    template: require('./configuration-upload-sftp.html'),
    controller: ConfigurationUploadSftpController
};