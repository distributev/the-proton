class ConfigurationEmailSettingsController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {}

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationEmailSettingsComponent = {
    bindings: {},
    template: require('./configuration-email-settings.html'),
    controller: ConfigurationEmailSettingsController
};