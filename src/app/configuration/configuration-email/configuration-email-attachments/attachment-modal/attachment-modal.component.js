class AttachmentModalController {
    constructor($timeout) {
        'ngInject';
        this.$timeout = $timeout;
    }

    $onInit() {}

    $onChanges(changes) {}

    selectFile({ path }) {
        this.$timeout(() => {
            this.resolve.path = path;
            // angular.element($event.target).parents('.form-group').find('input')[0].focus();
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