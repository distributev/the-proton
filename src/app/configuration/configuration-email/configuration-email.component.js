class ConfigurationEmailController {
    constructor($state) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {}

    $onChanges(changes) {}

    onSubmit() {

    }
}

export const ConfigurationEmailComponent = {
    bindings: {},
    template: require('./configuration-email.html'),
    controller: ConfigurationEmailController
};