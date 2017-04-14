import _ from 'lodash';

class ConfigurationAdvancedController {
    constructor($state, $uibModal, ConfigurationTemplatesService) {
        'ngInject';
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
    }

    $onInit() {
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
}

export const ConfigurationAdvancedComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-advanced.html'),
    controller: ConfigurationAdvancedController
};
