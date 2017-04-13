import _ from 'lodash';

class ConfigurationAdvancedController {
    constructor($state, $uibModal, ConfigurationTemplatesService) {
        'ngInject';
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
    }

    $onInit() {
        this.form = angular.copy(_.pick(this.template, [
                'path',
                'name',
                'failJobIfAnyDistributionFails'
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
                message: () => `Configuration '${this.form.name}' loaded!`
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
            });
    }

    onCancel() {
        this.ConfigurationTemplatesService.resetCurrentTemplate()
            .then(template => this.form = template);
    }
}

export const ConfigurationAdvancedComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-advanced.html'),
    controller: ConfigurationAdvancedController
};
