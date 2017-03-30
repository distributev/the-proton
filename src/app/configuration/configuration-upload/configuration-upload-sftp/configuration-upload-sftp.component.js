class ConfigurationUploadSftpController {
    constructor(ConfigurationTemplatesService, $state, $timeout, $uibModal) {
        'ngInject';
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
        this.$state = $state;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.formData = {};
    }

    $onInit() {
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
                        message: () => `Uplaod SFTP settings saved!`
                    }
                });
            })
    }

    onCancel() {
        this.$state.reload();
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

export const ConfigurationUploadSftpComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-upload-sftp.html'),
    controller: ConfigurationUploadSftpController
};
