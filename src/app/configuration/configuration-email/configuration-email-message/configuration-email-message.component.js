import fsExtra from 'fs-extra';
import path from 'path';
import Promise from 'bluebird';
const fs = Promise.promisifyAll(fsExtra);

class ConfigurationEmailMessageController {
    constructor($state, $uibModal, $timeout, $sce, $interpolate, ConfigurationTemplatesService, configPath) {
        'ngInject';
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.$timeout = $timeout;
        this.$sce = $sce;
        this.$interpolate = $interpolate;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
        this.configPath = configPath;
    }

    $onInit() {
        this.currentTemplateSubscription = this.ConfigurationTemplatesService.subscribe(template => this.loadTemplate(template));
        this.activeTab = 1;
        console.log(this.getMessageDefaultPath());
    }

    $onChanges(changes) {}

    $onDestroy() {
        this.currentTemplateSubscription.dispose();
    }

    loadTemplate(template) {
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
        this.ConfigurationTemplatesService.setTemplate(this.template)
            .then(() => {
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
        this.$state.reload();
    }

    htmlEmailToggle() {
        if (!this.template.htmlEmail && this.activeTab === 0) {
            this.activeTab = 1;
        }
    }

    showLargerMessageModal() {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'configurationEmailMessageLargerModal',
            size: 'lg',
            resolve: {
                email: () => {
                    return {
                        htmlEmail: this.template.htmlEmail,
                        emailSettings: {
                            text: this.template.emailSettings.text,
                            html: this.template.emailSettings.html
                        }
                    }
                }
            }
        });

        modalInstance.result.then(result => {
            this.template.htmlEmail = result.htmlEmail;
            this.template.emailSettings.text = result.emailSettings.text;
            this.template.emailSettings.html = result.emailSettings.html;
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input,textarea');
            let inputModel;
            if (targetInput.length > 1) {
                if (this.activeTab === 0) {
                    inputModel = angular.element(targetInput[0]).parent()[0].getAttribute('ng-model').split('.').pop();
                } else {
                    inputModel = targetInput[1].getAttribute('ng-model').split('.').pop();
                }
            } else {
                inputModel = targetInput[0].getAttribute('ng-model').split('.').pop();
            }
            this.template.emailSettings[inputModel] = this.template.emailSettings[inputModel] ? this.template.emailSettings[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }

    templateSelected($event) {
        this.ConfigurationTemplatesService.getFile($event.path)
            .then(data => {
                if (this.activeTab === 0) {
                    this.$timeout(() => {
                        this.template.emailSettings.html = angular.copy(data);
                    });
                } else {
                    this.$timeout(() => {
                        this.template.emailSettings.text = angular.copy(data);
                    });
                }
            })
            .catch(console.warn);
    }

    saveTemplate($event) {
        let data;
        if (this.activeTab === 0) {
            data = this.template.emailSettings.html;
        } else {
            data = this.template.emailSettings.text;
        }
        this.ConfigurationTemplatesService.saveFile($event.path, data)
            .then(() => {
                this.$uibModal.open({
                    animation: true,
                    component: 'feedbackModal',
                    size: 'sm',
                    resolve: {
                        message: () => `Email Message template saved!`
                    }
                });
            })
            .catch(console.warn);
    }

    toggleMessagePreview() {
        this.showPreview = !this.showPreview;
    }

    getMessageDefaultPath() {
        return path.join(__dirname, this.configPath, 'templates', this.activeTab === 0 ? 'html' : 'text');
    }

    getPreview(tpl) {
        // TODO: implement Variables logic
        return this.$interpolate(tpl)({ custom1: 'Value' });
    }

    getTrustedHtml() {
        return this.$sce.trustAsHtml(this.getPreview(this.template.emailSettings.html));
    }
}

export const ConfigurationEmailMessageComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-email-message.html'),
    controller: ConfigurationEmailMessageController
};