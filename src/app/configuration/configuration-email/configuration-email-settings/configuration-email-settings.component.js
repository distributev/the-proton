class ConfigurationEmailSettingsController {
    constructor($state, ConfigurationEmailService, $timeout, $uibModal) {
        'ngInject';
        this.$state = $state;
        this.configurationEmailService = ConfigurationEmailService;
        this.$timeout = $timeout;
        this.formData = {};
        this.$uibModal = $uibModal;
    }

    $onInit() {
        this.cloudProviders = this.configurationEmailService.getCloudProviders();
        this.selectedCloudProvider = this.cloudProviders[0];
    }

    $onChanges(changes) {}

    onSubmit() {

    }

    showWellKnownServicesModal() {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'wellKnownServicesModal',
            size: 'sm',
            resolve: {}
        });

        modalInstance.result.then(result => {
            console.log(result);
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
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