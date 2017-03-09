import path from 'path';
import url from 'url';
import _ from 'lodash';
import { remote } from 'electron';
const { BrowserWindow, dialog } = remote;

class ConfigurationEmailAttachmentsController {
    constructor($state, $uibModal, $timeout, ConfigurationTemplatesService) {
        'ngInject';
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.$timeout = $timeout;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
    }

    $onInit() {
        this.selectedAttachment = [];
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
        this.currentTemplateSubscription = this.ConfigurationTemplatesService.subscribe(template => this.loadTemplate(template));
    }

    $onChanges(changes) {}

    $onDestroy() {
        this.currentTemplateSubscription.dispose();
    }

    loadTemplate(template) {
        console.log(template);
        this.template = template;
        this.$uibModal.open({
            animation: true,
            component: 'feedbackModal',
            size: 'sm',
            resolve: {
                message: () => `Configuration '${this.template.name}'loaded!`
            }
        });
    }

    onSubmit() {
        console.log(this.template);
        // this.ConfigurationTemplatesService.setTemplate(this.template)
        //     .then(() => {
        //         this.$uibModal.open({
        //             animation: true,
        //             component: 'feedbackModal',
        //             size: 'sm',
        //             resolve: {
        //                 message: () => `Configuration settings saved!`
        //             }
        //         });
        //     });
    }

    getSelectedAttachment() {
        return this.selectedAttachment[0] ? this.selectedAttachment[0] : false;
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.template.attachments.archive[inputModel] = this.template.attachments.archive[inputModel] ? this.template.attachments.archive[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }

    showAddOrEditModal(attachment) {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'attachmentModal',
            resolve: {
                path: () => attachment ? attachment.$.path : null
            }
        });

        modalInstance.result.then(result => {
            if (attachment) {
                let index = _.indexOf(this.template.attachments.items.attachment, attachment);
                this.template.attachments.items.attachment[index].$.path = result;
            } else {
                this.template.attachments.items.attachment.push({
                    $: {
                        path: result
                    }
                });
            }
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
    }

    removeAttachment(attachment) {
        if (attachment) {
            _.remove(this.template.attachments.items.attachment, { '$.path': attachment.$.path });
        }
    }

    attachmentUp(attachment) {
        let index = _.indexOf(this.template.attachments.items.attachment, attachment);
        if (index > 0) {
            this.move(this.template.attachments.items.attachment, index, index - 1);
        }
    }

    attachmentDown(attachment) {
        let index = _.indexOf(this.template.attachments.items.attachment, attachment);
        if (index < this.template.attachments.items.attachment.length) {
            this.move(this.template.attachments.items.attachment, index, index + 1);
        }
    }

    move(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }

    clearAttachments() {
        this.template.attachments.items.attachment = [];
    }
}

export const ConfigurationEmailAttachmentsComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-email-attachments.html'),
    controller: ConfigurationEmailAttachmentsController
};