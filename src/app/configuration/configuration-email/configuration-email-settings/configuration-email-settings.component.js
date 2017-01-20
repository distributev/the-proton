class ConfigurationEmailSettingsController {
    constructor($state, ConfigurationEmailService) {
        'ngInject';
        this.$state = $state;
        this.configurationEmailService = ConfigurationEmailService;
    }

    $onInit() {
        this.cloudProviders = this.configurationEmailService.getCloudProviders();
        this.selectedCloudProvider = this.cloudProviders[0];
    }

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationEmailSettingsComponent = {
    bindings: {},
    template: require('./configuration-email-settings.html'),
    controller: ConfigurationEmailSettingsController
};