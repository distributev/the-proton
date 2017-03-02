class FeedbackModalController {
    constructor() {
        'ngInject';
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

export const FeedbackModalComponent = {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./feedback-modal.html'),
    controller: FeedbackModalController
};