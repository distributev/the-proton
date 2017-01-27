class EditTemplateModalController {
    constructor($timeout) {
        'ngInject';
        this.$timeout = $timeout;
    }

    $onInit() {
        this.resolve = {
            template: {
                name: '',
                copyFrom: './config/default/defaults.xml',
                path: '',
                howTo: ''
            }
        };
    }

    $onChanges(changes) {
        if (changes.resolve.template) {
            console.log('changes.resolve.template', changes.resolve.template);
            if (changes.resolve.template.isFirstChange()) {
                console.log('changes.resolve.template.isFirstChange()');
            }
        }

        // this.resolve.template.name = angular.copy(this.resolve.template.name);
        // this.resolve.template.name = angular.copy(this.resolve.template.name);
        //         copyFrom: './config/default/defaults.xml',
        //         path: './config/' + _.kebabCase(this.resolve.template.name),
        //         howTo: '<config>' + this.resolve.template.path + '</config>'
        // };
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