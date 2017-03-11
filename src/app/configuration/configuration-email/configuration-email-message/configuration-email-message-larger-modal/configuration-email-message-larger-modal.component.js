class ConfigurationEmailMessageLargerModalController {
    constructor($timeout, $sce, $interpolate) {
        'ngInject';
        this.$timeout = $timeout;
        this.$sce = $sce;
        this.$interpolate = $interpolate;
    }

    $onInit() {
        this.template = angular.copy(this.resolve.email);
        this.activeTab = 1;
    }

    $onChanges(changes) {}

    ok() {
        this.close({ $value: this.template });
    }

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }

    htmlEmailToggle() {
        if (!this.template.htmlEmail && this.activeTab === 0) {
            this.activeTab = 1;
        }
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.modal-body').find('textarea');
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

    toggleMessagePreview() {
        this.showPreview = !this.showPreview;
    }

    getPreview(tpl) {
        // TODO: implement Variables logic
        return this.$interpolate(tpl)({ custom1: 'Value' });
    }

    getTrustedHtml() {
        return this.$sce.trustAsHtml(this.getPreview(this.template.emailSettings.html));
    }
}

export const ConfigurationEmailMessageLargerModalComponent = {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./configuration-email-message-larger-modal.html'),
    controller: ConfigurationEmailMessageLargerModalController
};