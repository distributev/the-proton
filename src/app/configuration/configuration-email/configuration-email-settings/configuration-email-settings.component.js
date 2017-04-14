import _ from 'lodash';

class ConfigurationEmailSettingsController {
    constructor($state, ConfigurationEmailService, ConfigurationTemplatesService, $timeout, $uibModal) {
        'ngInject';
        this.$state = $state;
        this.configurationEmailService = ConfigurationEmailService;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
    }

    $onInit() {
        this.previousTemplate = angular.copy(this.template);
        this.cloudProviders = _.filter(this.configurationEmailService.getCloudProviders(), each => each.name !== 'Mandrill');
        this.selectedCloudProvider = this.cloudProviders[0];
        this.currentTemplateSubscription = this.ConfigurationTemplatesService.subscribe(template => this.loadTemplate(template));
        this.resetTemplateSubscription = this.ConfigurationTemplatesService.subscribeToChanges(changes => this.showPendingChanges = changes);
        this.resetTemplateSubscription = this.ConfigurationTemplatesService.subscribeToReset(template => this.template = template);
    }

    $onChanges(changes) {
        if (changes.template) {
            this.template = angular.copy(this.template);
        }
    }

    $doCheck() {
        if (!angular.equals(this.template, this.previousTemplate)) {
            this.ConfigurationTemplatesService.setCurrentTemplate(angular.copy(this.template))
            .then(() => {
                this.previousTemplate = angular.copy(this.template);
            });
        }
    }

    $onDestroy() {
        this.currentTemplateSubscription.dispose();
    }

    loadTemplate(template) {
        if (this.template.path !== template.path) {
            this.template = angular.copy(template);
            this.$uibModal.open({
                animation: true,
                component: 'feedbackModal',
                size: 'sm',
                resolve: {
                    message: () => `Configuration '${this.template.name}'loaded!`
                }
            });
        }
    }

    onSubmit() {
        this.ConfigurationTemplatesService.setTemplate(this.template)
            .then(template => {
                this.template = angular.copy(template);
                this.$uibModal.open({
                    animation: true,
                    component: 'feedbackModal',
                    size: 'sm',
                    resolve: {
                        message: () => `Configuration settings saved!`
                    }
                });
            });
    }

    onCancel() {
        this.ConfigurationTemplatesService.resetCurrentTemplate()
            .then(template => this.template = template);
    }

    showWellKnownServicesModal() {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'wellKnownServicesModal',
            size: 'sm',
            resolve: {}
        });

        modalInstance.result.then(result => {
            this.template.emailServer.host = result.host || '';
            this.template.emailServer.port = result.port || '';
            this.template.emailServer.useSsl = result.secure || false;
            this.template.emailServer.useTls = result.tls ? true : false;
        });
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.template.emailServer[inputModel] = this.template.emailServer[inputModel] ? this.template.emailServer[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }
}

export const ConfigurationEmailSettingsComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-email-settings.html'),
    controller: ConfigurationEmailSettingsController
};
