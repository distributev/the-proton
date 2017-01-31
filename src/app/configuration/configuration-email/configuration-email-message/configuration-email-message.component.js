class ConfigurationEmailMessageController {
    constructor($state, $uibModal, $timeout) {
        'ngInject';
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.$timeout = $timeout;
    }

    $onInit() {
        this.formData = { isHtmlEnabled: true };
    }

    $onChanges(changes) {}

    onSubmit() {

    }

    showLargerMessageModal() {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'configurationEmailMessageLargerModal',
            size: 'lg',
            resolve: {
                email: () => {
                    return {
                        isHtmlEnabled: this.formData.isHtmlEnabled,
                        text: this.formData.text,
                        html: this.formData.html
                    }
                }
            }
        });

        modalInstance.result.then(result => {
            this.formData.isHtmlEnabled = result.isHtmlEnabled;
            this.formData.text = result.text;
            this.formData.html = result.html;
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.formData[inputModel] = this.formData[inputModel] ? this.formData[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }

    templateSelected({ path }) {
        // TODO: Load template
        // this.$timeout(() => {
        //     this.resolve.path = path;
        // });
    }
}

export const ConfigurationEmailMessageComponent = {
    bindings: {},
    template: require('./configuration-email-message.html'),
    controller: ConfigurationEmailMessageController
};