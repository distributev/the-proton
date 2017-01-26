import electron from 'electron';
const { dialog } = electron.remote;

class AttachmentModalController {
    constructor($timeout) {
        'ngInject';
        this.$timeout = $timeout;
    }

    $onInit() {}

    $onChanges(changes) {}

    selectFile($event) {
        let options = {
            title: 'Attachments',
            properties: [
                'openFile'
            ]
        }

        dialog.showOpenDialog(options, filePaths => {
            this.$timeout(() => {
                this.resolve.path = filePaths[0];
                angular.element($event.target).parents('.form-group').find('input')[0].focus();
            });
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