class ConfigurationEmailMessageController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {}

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationEmailMessageComponent = {
    bindings: {},
    template: require('./configuration-email-message.html'),
    controller: ConfigurationEmailMessageController
};