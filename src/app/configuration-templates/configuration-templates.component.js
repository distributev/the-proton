import _ from 'lodash';

class ConfigurationTemplatesController {
    constructor($state, $uibModal, ConfigurationTemplatesService, defaultSettingsFile) {
        'ngInject';
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
        this.defaultSettingsFile = defaultSettingsFile;
    }

    $onInit() {
        this.formData = {
            templates: []
        };
        angular.forEach(this.templates, template => {
            let tpl = angular.copy(template);
            tpl.name = template.name;
            tpl.path = template.path;
            tpl.active = false;
            this.formData.templates.push(template);
        });
    }

    $onChanges(changes) {}

    onSubmit() {
        this.formData.templates.forEach((template, index) => template = this.formData.templates[index]);
        this.ConfigurationTemplatesService.setTemplates(this.formData.templates)
            .then(() => {
                let modalInstance = this.$uibModal.open({
                    animation: true,
                    component: 'feedbackModal',
                    size: 'sm',
                    resolve: {
                        message: () => `Configuration Templates saved!`
                    }
                });

                modalInstance.result.then(() => {
                    this.$state.reload();
                });
            })
            .catch(console.warn);
    }

    onCancel() {
        this.$state.reload();
    }

    showAddOrEditModal(template) {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'editTemplateModal',
            resolve: {
                template: () => angular.copy(template)
            }
        });

        modalInstance.result.then(result => {
            if (template) {
                let index = _.indexOf(this.formData.templates, template);
                this.formData.templates[index] = result;
            } else {
                this.formData.templates.push(result);
            }
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
    }

    getSelectedTemplate() {
        return _.find(this.formData.templates, 'active');
    }

    onTemplateClick(template) {
        angular.forEach(this.formData.templates, each => {
            each.active = (each.path === template.path) ? true : false;
        });
    }

    removeTemplate(template) {
        if (template) {
            _.remove(this.formData.templates, { path: template.path });
        }
    }
}

export const ConfigurationTemplatesComponent = {
    bindings: {
        templates: '<'
    },
    template: require('./configuration-templates.html'),
    controller: ConfigurationTemplatesController
};