import electron from 'electron';
const { dialog } = electron.remote;

class ProcessingQualityController {
    constructor($state, $timeout, $uibModal) {
        'ngInject';
        this.$state = $state;
        this.$timeout = $timeout;
        this.formData = {}
        this.$uibModal = $uibModal;
    }

    $onInit() {
        this.formData.test = 'all';
    }

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

export const ProcessingQualityComponent = {
    bindings: {},
    template: require('./processing-quality.html'),
    controller: ProcessingQualityController
};