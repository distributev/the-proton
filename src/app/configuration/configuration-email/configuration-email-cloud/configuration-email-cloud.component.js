class ConfigurationEmailCloudController {
    constructor($state, ConfigurationEmailService) {
        'ngInject';
        this.$state = $state;
        this.configurationEmailService = ConfigurationEmailService;
    }

    $onInit() {
        this.cloudProviders = this.configurationEmailService.getCloudProviders();
    }

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationEmailCloudComponent = {
    bindings: {},
    template: require('./configuration-email-cloud.html'),
    controller: ConfigurationEmailCloudController
};