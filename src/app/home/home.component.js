class HomeController {
    constructor() {
        'ngInject';
    }
    $onInit() {}

    $onChanges(changes) {}
}

export const HomeComponent = {
    bindings: {},
    template: require('./home.html'),
    controller: HomeController
};