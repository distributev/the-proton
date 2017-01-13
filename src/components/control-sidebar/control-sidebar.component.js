import angular from 'angular';

export class ControlSidebarController {
    /*@ngInject*/
    constructor() {
        this.message = 'World';
    }
}

export default angular.module('theProtonApp.control-sidebar', [])
    .component('controlSidebar', {
        template: require('./control-sidebar.html'),
        bindings: { message: '<' },
        controller: ControlSidebarController
    })
    .name;