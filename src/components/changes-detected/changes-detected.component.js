class ChangesDetectedController {
    constructor($uibModal, ConfigurationTemplatesService) {
        'ngInject';
        this.$uibModal = $uibModal;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
    }

    $onInit() {
        this.ConfigurationTemplatesService.getCurrentTemplate()
            .then(() => {
                this.ConfigurationTemplatesService.subscribeToChanges(changes => this.show = changes);
            });
    }

    $onChanges(changes) {}

    onSave() {
        this.ConfigurationTemplatesService.setTemplate()
            .then(() => {
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
            .then(template => this.currentTemplate = template);
    }

}

export const ChangesDetectedComponent = {
    bindings: {},
    template: require('./changes-detected.html'),
    controller: ChangesDetectedController
};
