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
        this.cloudProviders = _.filter(this.configurationEmailService.getCloudProviders(), each => each.name !== 'Mandrill');
        this.selectedCloudProvider = this.cloudProviders[0];
        this.form = angular.copy(_.pick(this.template, [
                'path',
                'name',
                'emailServer'
            ]));
        this.currentTemplateSubscription = this.ConfigurationTemplatesService.subscribe(template => this.loadTemplate(template));
    }

    $onChanges(changes) {}

    $doCheck() {
        this.saved = angular.copy(_.pick(this.template, _.keys(this.form)));
        if (!angular.equals(this.form, this.saved)) {
            this.showPendingChanges = true;
        }
        else {
            this.showPendingChanges = false;
        }
    }

    $onDestroy() {
        this.ConfigurationTemplatesService.setCurrentTemplate(this.form);
        this.currentTemplateSubscription.dispose();
    }

    loadTemplate(template) {
        this.form = angular.copy(_.pick(template, _.keys(this.form)));
        this.$uibModal.open({
            animation: true,
            component: 'feedbackModal',
            size: 'sm',
            resolve: {
                message: () => `Configuration '${this.form.name}'loaded!`
            }
        });
    }

    onSubmit() {
        this.ConfigurationTemplatesService.setTemplate(this.form)
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
            })
    }

    onCancel() {
        this.ConfigurationTemplatesService.resetCurrentTemplate()
            .then(template => this.form = template);
    }

    showWellKnownServicesModal() {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'wellKnownServicesModal',
            size: 'sm',
            resolve: {}
        });

        modalInstance.result.then(result => {
            this.form.emailServer.host = result.host || '';
            this.form.emailServer.port = result.port || '';
            this.form.emailServer.useSsl = result.secure || false;
            this.form.emailServer.useTls = result.tls ? true : false;
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.form.emailServer[inputModel] = this.form.emailServer[inputModel] ? this.form.emailServer[inputModel] + variable.name : variable.name;
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
