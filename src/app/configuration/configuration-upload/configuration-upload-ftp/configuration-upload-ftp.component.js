class ConfigurationUploadFtpController {
    constructor(ConfigurationTemplatesService, $state, $timeout, $uibModal) {
        'ngInject';
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
        this.$state = $state;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.formData = {};
    }

    $onInit() {
        this.form = angular.copy(_.pick(this.template, [
                'path',
                'name',
                'uploadSettings'
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
                        message: () => `Uplaod FTP settings saved!`
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
            this.formData[inputModel] = this.formData[inputModel] ? this.formData[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }
}

export const ConfigurationUploadFtpComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-upload-ftp.html'),
    controller: ConfigurationUploadFtpController
};
