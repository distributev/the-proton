import path from 'path';
import url from 'url';
import _ from 'lodash';
import { remote } from 'electron';
const { BrowserWindow, dialog } = remote;

class ConfigurationEmailAttachmentsController {
    constructor($state, $uibModal) {
        'ngInject';
        this.$state = $state;
        this.$uibModal = $uibModal;
    }

    $onInit() {
        this.formData = {
            selectedAttachment: [],
            attachments: [{
                    path: '{{custom1}}'
                },
                {
                    path: '{{custom2}}'
                }
            ],
            archive: false,
            archiveFileName: 'reports-{{custom3}}.zip'
        };
    }

    $onChanges(changes) {}

    onSubmit() {

    }

    getSelectedAttachment() {
        return this.formData.selectedAttachment[0] ? this.formData.selectedAttachment[0] : false;
    }

    showAddOrEditModal(attachment) {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'attachmentModal',
            resolve: {
                path: () => attachment ? attachment.path : null
            }
        });

        modalInstance.result.then(result => {
            if (attachment) {
                let index = _.indexOf(this.formData.attachments, attachment);
                this.formData.attachments[index].path = result;
            } else {
                this.formData.attachments.push({
                    path: result
                });
            }
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
    }

    removeAttachment(attachment) {
        if (attachment) {
            _.remove(this.formData.attachments, { path: attachment.path });
        }
    }

    attachmentUp(attachment) {
        let index = _.indexOf(this.formData.attachments, attachment);
        if (index > 0) {
            this.move(this.formData.attachments, index, index - 1);
        }
    }

    attachmentDown(attachment) {
        let index = _.indexOf(this.formData.attachments, attachment);
        if (index < this.formData.attachments.length) {
            this.move(this.formData.attachments, index, index + 1);
        }
    }

    move(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }

    clearAttachments() {
        this.formData.attachments = [];
    }
}

export const ConfigurationEmailAttachmentsComponent = {
    bindings: {},
    template: require('./configuration-email-attachments.html'),
    controller: ConfigurationEmailAttachmentsController
};