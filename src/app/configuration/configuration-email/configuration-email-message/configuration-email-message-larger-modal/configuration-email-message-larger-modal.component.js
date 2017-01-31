class ConfigurationEmailMessageLargerModalController {
    constructor($timeout) {
        'ngInject';
        this.$timeout = $timeout;
    }

    $onInit() {
        this.formData = angular.copy(this.resolve.email);
    }

    $onChanges(changes) {}

    ok() {
        this.close({ $value: this.formData });
    }

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.formData[inputModel] = this.formData[inputModel] ? this.formData[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
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