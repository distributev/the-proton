import electron from 'electron';
const { dialog } = electron.remote;
import path from 'path';

class ProcessingQualityController {
    constructor($state, $timeout, $uibModal, JobService) {
        'ngInject';
        this.$state = $state;
        this.$timeout = $timeout;
        this.formData = {}
        this.$uibModal = $uibModal;
        this.JobService = JobService;
    }

    $onInit() {
        this.formData.test = 'all';
    }

    $onChanges(changes) {}

    filePathSelected({
        path
    }) {
        this.$timeout(() => {
            this.formData.filePath = path;
        });
    }

    doAction() {
        let args = this.formData.filePath.split(' ').slice(1);
        if (this.formData.test === 'all') args.push('-ta');
        else if (this.formData.test === 'following') {
            args.push(`-tf`);
            args.push(`'${this.formData.following}'`);
        }
        else if (this.formData.test === 'random') {
            args.push(`-tr`);
            args.push(`${this.formData.random}`);
        }
        let job = {
            command: this.formData.filePath.split(' ')[0],
            args: args,
            documentName: path.basename(this.formData.filePath).split('.')[0],
            type: 'test'
        };
        console.log('job', job);
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

export const ProcessingQualityComponent = {
    bindings: {},
    template: require('./processing-quality.html'),
    controller: ProcessingQualityController
};
