import _ from 'lodash';

class ConfigurationTemplatesController {
    constructor($state, $uibModal) {
        'ngInject';
        this.$state = $state;
        this.$uibModal = $uibModal;
    }

    $onInit() {
        this.formData = {
            templates: [{
                name: 'My Default Config Template(*)',
                path: './config/settings.xml',
                howTo: 'Fallback used when no other configuration',
                active: false
            }, {
                name: 'invoices',
                path: './config/invoices.xml',
                howTo: 'Fallback used when no other configuration',
                active: false
            }, {
                name: 'statements',
                path: './config/statements.xml',
                howTo: 'Fallback used when no other configuration',
                active: false
            }]
        };
    }

    $onChanges(changes) {}

    onSubmit() {

    }

    showAddOrEditModal(template) {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'editTemplateModal',
            resolve: {
                template: () => template
            }
        });

        modalInstance.result.then(result => {
            if (template) {
                let index = _.indexOf(this.formData.templates, template);
                this.formData.templates[index] = result;
            } else {
                this.formData.templates.push(template);
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
    bindings: {},
    template: require('./configuration-templates.html'),
    controller: ConfigurationTemplatesController
};