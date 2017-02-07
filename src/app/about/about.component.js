class AboutController {
    constructor($state, $timeout) {
        'ngInject';
        this.$state = $state;
    }

    $onInit() {}

    $onChanges(changes) {}
}

export const AboutComponent = {
    bindings: {},
    template: require('./about.html'),
    controller: AboutController
};