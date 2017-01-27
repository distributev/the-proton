class ConfigurationAdvancedController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {
        this.formData = {
            distFail: 'fail_job'
        };
    }

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationAdvancedComponent = {
    bindings: {},
    template: require('./configuration-advanced.html'),
    controller: ConfigurationAdvancedController
};