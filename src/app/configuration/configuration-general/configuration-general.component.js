import electron from 'electron';
const { dialog } = electron.remote;
import _ from 'lodash';

class ConfigurationGeneralController {
    constructor($state, $timeout, $uibModal, ConfigurationTemplatesService) {
        'ngInject';
        this.$state = $state;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
    }

    $onInit() {
        this.form = angular.copy(_.pick(this.template, [
                'path',
                'name',
                'fileName',
                'outputFolder',
                'quarantineFolder',
                'sendDocuments',
                'deleteDocuments',
                'quarantineDocuments'
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
            })
    }

    onCancel() {
        this.ConfigurationTemplatesService.resetCurrentTemplate()
            .then(template => this.form = template);
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.form[inputModel] = this.form[inputModel] ? this.form[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }

    outputSelected({ path }) {
        this.$timeout(() => {
            this.form.outputFolder = path;
        });
    }

    quarantineSelected({ path }) {
        this.$timeout(() => {
            this.form.quarantineFolder = path;
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
