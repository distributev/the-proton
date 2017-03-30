import path from 'path';

class ProcessingDoActionController {
    constructor($state, $timeout, $uibModal, JobService) {
        'ngInject';
        this.$state = $state;
        this.$timeout = $timeout;
        this.formData = {}
        this.$uibModal = $uibModal;
        this.JobService = JobService;
    }

    $onInit() {}

    $onChanges(changes) {}

    filePathSelected({ path }) {
        this.$timeout(() => {
            this.formData.filePath = path;
        });
    }

    doAction() {
        let job = {
            command: this.formData.filePath.split(' ')[0],
            args: this.formData.filePath.split(' ').slice(1),
            documentName: path.basename(this.formData.filePath).split('.')[0],
            type: 'test'
        };
        this.JobService.createJob(job)
            .then(job => this.JobService.runJob(job))
            .then(job => console.log('Running Job: ', job.id))
            .catch(console.warn);
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
                this.doAction();
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
