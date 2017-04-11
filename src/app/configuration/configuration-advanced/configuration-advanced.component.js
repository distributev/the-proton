class ConfigurationAdvancedController {
    constructor($state, $uibModal, ConfigurationTemplatesService) {
        'ngInject';
        this.$state = $state;
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
