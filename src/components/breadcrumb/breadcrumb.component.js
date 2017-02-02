import _ from 'lodash';

class BreadcrumbController {
    constructor(BreadcrumbService) {
        'ngInject';
        this.BreadcrumbService = BreadcrumbService;
        this.path = [];
    }

    $onInit() {
        this.currentState = this.BreadcrumbService.getCurrentState();
        this.subscription = this.BreadcrumbService.subscribe(state => this.updateBreadcrumb(state));
    }

    $onChanges(changes) {}

    $onDestroy() {
        this.subscription.dispose();
    }

    updateBreadcrumb(state) {
        this.path.length = 0;
        angular.extend(this.path, _.map(state, each => {
            return {
                name: each.state.name,
                label: _.startCase(_.kebabCase(each.state.name.split('.').pop()))
            };
        }));
    }

}

export const BreadcrumbComponent = {
    bindings: {},
    template: require('./breadcrumb.html'),
    controller: BreadcrumbController
};