class ConfigurationEmailSettingsController {
    constructor($state, ConfigurationEmailService, $timeout) {
        'ngInject';
        this.$state = $state;
        this.configurationEmailService = ConfigurationEmailService;
        this.$timeout = $timeout;
        this.formData = {};
    }

    $onInit() {
        this.cloudProviders = this.configurationEmailService.getCloudProviders();
        this.selectedCloudProvider = this.cloudProviders[0];
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

export const ConfigurationEmailSettingsComponent = {
    bindings: {},
    template: require('./configuration-email-settings.html'),
    controller: ConfigurationEmailSettingsController
};