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
        this.cloudProviders = _.filter(this.configurationEmailService.getCloudProviders(), each => each.name !== 'Mandrill');
        this.selectedCloudProvider = this.cloudProviders[0];
        this.currentTemplateSubscription = this.ConfigurationTemplatesService.subscribe(template => this.loadTemplate(template));
    }

    $onChanges(changes) {}

    $onDestroy() {
        this.currentTemplateSubscription.dispose();
    }

    loadTemplate(template) {
        this.template = template;
        this.$uibModal.open({
            animation: true,
            component: 'feedbackModal',
            size: 'sm',
            resolve: {
                message: () => `Configuration '${this.template.name}'loaded!`
            }
        });
    }

    onSubmit() {
        this.ConfigurationTemplatesService.setTemplate(this.template)
            .then(() => {
                this.$uibModal.open({
                    animation: true,
                    component: 'feedbackModal',
                    size: 'sm',
                    resolve: {
                        message: () => `Configuration settings saved!`
                    }
                });
            })
    }

    onCancel() {
        this.$state.reload();
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
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
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