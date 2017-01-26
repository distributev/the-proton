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