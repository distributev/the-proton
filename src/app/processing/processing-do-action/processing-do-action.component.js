import electron from 'electron';
const { dialog } = electron.remote;

class ProcessingDoActionController {
    constructor($state, $timeout, $uibModal) {
        'ngInject';
        this.$state = $state;
        this.$timeout = $timeout;
        this.formData = {}
        this.$uibModal = $uibModal;
    }

    $onInit() {}

    $onChanges(changes) {}

    filePathSelected({ path }) {
        this.$timeout(() => {
            this.formData.filePath = path;
        });
    }

    showConfirmModal() {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'confirmationModal',
            size: 'sm',
            resolve: {
                title: () => '',
                message: () => 'Are you sure you want to post another job?'
            }
        });

        modalInstance.result.then(result => {
            if (result) {
                // TODO: Process job
            }
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
    }
}

export const ProcessingDoActionComponent = {
    bindings: {},
    template: require('./processing-do-action.html'),
    controller: ProcessingDoActionController
};