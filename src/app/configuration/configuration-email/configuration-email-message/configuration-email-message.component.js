import path from 'path';
import _ from 'lodash';

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
        this.activeTab = 1;
        this.form = angular.copy(_.pick(this.template, [
                'path',
                'name',
                'emailSettings',
                'htmlEmail',
                'path'
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

    htmlEmailToggle() {
        if (!this.form.htmlEmail && this.activeTab === 0) {
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
                        htmlEmail: this.form.htmlEmail,
                        emailSettings: {
                            text: this.form.emailSettings.text,
                            html: this.form.emailSettings.html
                        }
                    }
                }
            }
        });

        modalInstance.result.then(result => {
            this.form.htmlEmail = result.htmlEmail;
            this.form.emailSettings.text = result.emailSettings.text;
            this.form.emailSettings.html = result.emailSettings.html;
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
            this.form.emailSettings[inputModel] = this.form.emailSettings[inputModel] ? this.form.emailSettings[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }

    templateSelected($event) {
        this.ConfigurationTemplatesService.getFile($event.path)
            .then(data => {
                if (this.activeTab === 0) {
                    this.$timeout(() => {
                        this.form.emailSettings.html = angular.copy(data);
                    });
                } else {
                    this.$timeout(() => {
                        this.form.emailSettings.text = angular.copy(data);
                    });
                }
            })
            .catch(console.warn);
    }

    saveTemplate($event) {
        let data;
        if (this.activeTab === 0) {
            data = this.form.emailSettings.html;
        } else {
            data = this.form.emailSettings.text;
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
        return this.$sce.trustAsHtml(this.getPreview(this.form.emailSettings.html));
    }
}

export const ConfigurationEmailMessageComponent = {
    bindings: {
        template: '<'
    },
    template: require('./configuration-email-message.html'),
    controller: ConfigurationEmailMessageController
};
