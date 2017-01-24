import electron from 'electron';
const { dialog } = electron.remote;

class AttachmentModalController {
    constructor() {
        'ngInject';
    }
    $onInit() {
        this.path = this.resolve.path || '';
    }

    $onChanges(changes) {}

    selectFile() {
        let options = {
            title: 'Attachments',
            properties: [
                'openFile'
            ]
        }

        dialog.showOpenDialog(options, filePaths => {
            console.log(filePaths);
            this.path = filePaths[0];
        });
    }

    ok() {
        this.close({ $value: this.path });
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