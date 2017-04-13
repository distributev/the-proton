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
        this.form = angular.copy(_.pick(this.template, [
                'path',
                'name',
                'attachments'
            ]));
        this.currentTemplateSubscription = this.ConfigurationTemplatesService.subscribe(template => this.loadTemplate(template));
    }

    $onChanges(changes) {}

    $doCheck() {
        this.saved = angular.copy(_.pick(this.template, _.keys(this.form)));
        if (!angular.equals(this.form, this.saved)) {
            this.showPendingChanges = true;
        }
        else {
            this.showPendingChanges = false;
        }
    }

    $onDestroy() {
        this.ConfigurationTemplatesService.setCurrentTemplate(this.form);
        this.currentTemplateSubscription.dispose();
    }

    loadTemplate(template) {
        this.form = angular.copy(_.pick(template, _.keys(this.form)));
        this.$uibModal.open({
            animation: true,
            component: 'feedbackModal',
            size: 'sm',
            resolve: {
                message: () => `Configuration '${this.form.name}'loaded!`
            }
        });
    }

    onSubmit() {
        angular.forEach(this.form.attachments.items.attachment, (attachment, index) => {
            attachment.$.order = index;
            delete attachment.$$hashKey;
        });
        this.ConfigurationTemplatesService.setTemplate(this.form)
            .then(template => {
                this.template = angular.copy(template);
                this.$uibModal.open({
                    animation: true,
                    component: 'feedbackModal',
                    size: 'sm',
                    resolve: {
                        message: () => `Configuration settings saved!`
                    }
                });
            });
    }

    onCancel() {
        this.ConfigurationTemplatesService.resetCurrentTemplate()
            .then(template => this.form = template);
    }

    getSelectedAttachment() {
        return this.selectedAttachment[0] ? this.selectedAttachment[0] : false;
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.form.attachments.archive[inputModel] = this.form.attachments.archive[inputModel] ? this.form.attachments.archive[inputModel] + variable.name : variable.name;
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
                let index = _.indexOf(this.form.attachments.items.attachment, attachment);
                this.form.attachments.items.attachment[index].$.path = result;
            } else {
                this.form.attachments.items.attachment.push({
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
            _.remove(this.form.attachments.items.attachment, o => o.$.path === attachment.$.path);
        }
    }

    attachmentUp(attachment) {
        let index = _.indexOf(this.form.attachments.items.attachment, attachment);
        if (index > 0) {
            this.move(this.form.attachments.items.attachment, index, index - 1);
        }
    }

    attachmentDown(attachment) {
        let index = _.indexOf(this.form.attachments.items.attachment, attachment);
        if (index < this.form.attachments.items.attachment.length) {
            this.move(this.form.attachments.items.attachment, index, index + 1);
        }
    }

    move(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }

    clearAttachments() {
        this.form.attachments.items.attachment = [];
    }
}

export const ConfigurationEmailAttachmentsComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-email-attachments.html'),
    controller: ConfigurationEmailAttachmentsController
};
