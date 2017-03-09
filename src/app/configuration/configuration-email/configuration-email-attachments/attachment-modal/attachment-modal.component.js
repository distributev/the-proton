import path from 'path';

class AttachmentModalController {
    constructor($timeout, configPath) {
        'ngInject';
        this.$timeout = $timeout;
        this.configPath = configPath;
    }

    $onInit() {}

    $onChanges(changes) {}

    selectFile($event) {
        this.$timeout(() => {
            this.resolve.path = './' + path.relative(path.join(__dirname, this.configPath), $event.path);
        });
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.resolve[inputModel] = this.resolve[inputModel] ? this.resolve[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }

    ok() {
        this.close({ $value: this.resolve.path });
    }

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }
}

export const AttachmentModalComponent = {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./attachment-modal.html'),
    controller: AttachmentModalController
};