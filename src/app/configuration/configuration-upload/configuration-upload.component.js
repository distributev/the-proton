class ConfigurationUploadController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {}

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationUploadComponent = {
    bindings: {},
    template: require('./configuration-upload.html'),
    controller: ConfigurationUploadController
};