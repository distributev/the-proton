class EditTemplateModalController {
    constructor($timeout) {
        'ngInject';
        this.$timeout = $timeout;
    }

    $onInit() {
        if (!this.resolve.template) this.resolve.template = { name: '' };
        this.resolve.template.copyFrom = this.resolve.template.copyFrom || './config/default/defaults.xml';
        this.updateForm();
    }

    $onChanges(changes) {}

    updateForm() {
        this.resolve.template.path = './config/' + _.kebabCase(this.resolve.template.name);
        this.resolve.template.howTo = '<config>' + this.resolve.template.path + '</config>';
    }

    selectFile({ path }) {
        this.$timeout(() => {
            this.resolve.template.copyFrom = path;
        });
    }

    ok() {
        this.close({ $value: this.resolve.template });
    }

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }
}

export const EditTemplateModalComponent = {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./edit-template-modal.html'),
    controller: EditTemplateModalController
};