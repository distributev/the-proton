class ConfigurationEmailAttachmentsController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {}

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationEmailAttachmentsComponent = {
    bindings: {},
    template: require('./configuration-email-attachments.html'),
    controller: ConfigurationEmailAttachmentsController
};