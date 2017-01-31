import electron from 'electron';
const { dialog } = electron.remote;

class ConfigurationGeneralController {
    constructor($state, $timeout) {
        'ngInject';
        this.$state = $state;
        this.$timeout = $timeout;
        this.formData = {}
    }

    $onInit() {}

    $onChanges(changes) {}

    onSubmit() {

    }

    variableSelected({ variable, target }) {
        this.$timeout(() => {
            let targetInput = angular.element(target).parents('.form-group').find('input')[0];
            let inputModel = targetInput.getAttribute('ng-model').split('.').pop();
            this.formData[inputModel] = this.formData[inputModel] ? this.formData[inputModel] + variable.name : variable.name;
            targetInput.focus();
        });
    }

    outputSelected({ path }) {
        this.$timeout(() => {
            this.formData.outputFolder = path;
        });
    }

    quarantineSelected({ path }) {
        this.$timeout(() => {
            this.formData.quarantineFolder = path;
        });
    }
}

export const ConfigurationGeneralComponent = {
    bindings: {},
    template: require('./configuration-general.html'),
    controller: ConfigurationGeneralController
};