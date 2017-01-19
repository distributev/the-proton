import _ from 'lodash';

class BreadcrumbController {
    constructor() {
        'ngInject';
    }

    $onInit() {
        this.path = _.map(this.$state.$current.name.split('.'), (each) => each = _.capitalize(each));
    }

    $onChanges(changes) {}

}

export const BreadcrumbComponent = {
    bindings: {
        $state: '<'
    },
    template: require('./breadcrumb.html'),
    controller: BreadcrumbController
};