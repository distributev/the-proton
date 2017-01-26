import _ from 'lodash';
import electron from 'electron';
const { dialog } = electron.remote;

class ElectronDialogButtonController {
    constructor() {
        'ngInject';
    }

    $onInit() {}

    $onChanges(changes) {}

    onClick() {
        let options = {
            title: 'Select ' + (this.dialogType === 'folder' ? 'Folder' : 'File'),
            properties: [
                'open' + (this.dialogType === 'folder' ? 'Directory' : 'File'),
            ]
        }
        dialog.showOpenDialog(options, paths => {
            if (paths && paths[0]) {
                this.onPathSelected({
                    $event: {
                        path: paths[0]
                    }
                });
            }
        });
    }

}

export const ElectronDialogButtonComponent = {
    bindings: {
        dialogType: '<',
        onPathSelected: '&'
    },
    template: require('./electron-dialog-button.html'),
    controller: ElectronDialogButtonController
};