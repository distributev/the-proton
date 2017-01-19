class ConfigurationGeneralController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {}

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationGeneralComponent = {
    bindings: {},
    template: require('./configuration-general.html'),
    controller: ConfigurationGeneralController
};