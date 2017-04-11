import electron from 'electron';
const { dialog } = electron.remote;

class ConfigurationGeneralController {
    constructor($state, $timeout, $uibModal, ConfigurationTemplatesService) {
        'ngInject';
        this.$state = $state;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
    }

    $onInit() {
        this.currentTemplateSubscription = this.ConfigurationTemplatesService.subscribe(template => this.loadTemplate(template));
    }

    $onChanges(changes) {}

    $onDestroy() {
        this.ConfigurationTemplatesService.setCurrentTemplate(this.template);
        this.currentTemplateSubscription.dispose();
    }

    loadTemplate(template) {
        this.template = template;
        this.$uibModal.open({
            animation: true,
            component: 'feedbackModal',
            size: 'sm',
            resolve: {
                message: () => `Configuration '${this.template.name}' loaded!`
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
        this.ConfigurationTemplatesService.resetCurrentTemplate()
            .then(template => this.template = template);
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.template[inputModel] = this.template[inputModel] ? this.template[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }

    outputSelected({ path }) {
        this.$timeout(() => {
            this.template.outputFolder = path;
        });
    }

    quarantineSelected({ path }) {
        this.$timeout(() => {
            this.template.quarantineFolder = path;
        });
    }
}

export const ConfigurationGeneralComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-general.html'),
    controller: ConfigurationGeneralController
};
