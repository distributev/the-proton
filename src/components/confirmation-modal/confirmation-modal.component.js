class ConfirmationModalController {
    constructor($timeout) {
        'ngInject';
        this.$timeout = $timeout;
    }

    $onInit() {}

    $onChanges(changes) {}

    ok() {
        this.close({ $value: true });
    }

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }
}

export const ConfirmationModalComponent = {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./confirmation-modal.html'),
    controller: ConfirmationModalController
};