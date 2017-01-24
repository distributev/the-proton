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
        this.attachments = [];
        this.selectedAttachment = [];
    }

    $onInit() {
        this.attachments = [{
                path: '{{custom1}}'
            },
            {
                path: '{{custom2}}'
            }
        ];
    }

    $onChanges(changes) {}

    onSubmit() {

    }

    getSelectedAttachment() {
        return this.selectedAttachment[0] ? this.selectedAttachment[0] : false;
    }

    showAddOrEditModal(isAdd) {
        if (!isAdd && !this.getSelectedAttachment()) return;

        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'attachmentModal',
            resolve: {
                path: () => {
                    return !isAdd ? this.getSelectedAttachment().path : null;
                }
            }
        });

        modalInstance.result.then(result => {
            console.log('modal-component closed with result: ' + result);
            this.attachments.push({
                path: result
            });
        }, reason => {
            console.log('modal-component dismissed with reason: ' + reason);
        });
    }

    removeAttachment() {
        if (this.getSelectedAttachment()) {
            _.remove(this.attachments, { path: this.getSelectedAttachment().path });
        }
    }

    attachmentUp() {

    }

    attachmentDown() {

    }

    clearAttachments() {
        this.attachments = [];
    }
}

export const ConfigurationEmailAttachmentsComponent = {
    bindings: {},
    template: require('./configuration-email-attachments.html'),
    controller: ConfigurationEmailAttachmentsController
};