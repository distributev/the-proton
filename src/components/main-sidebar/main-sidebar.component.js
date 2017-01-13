import angular from 'angular';

export class MainSidebarController {
    /*@ngInject*/
    constructor() {
        this.message = 'World';
    }
}

export default angular.module('theProtonApp.main-sidebar', [])
    .component('mainSidebar', {
        template: require('./main-sidebar.html'),
        bindings: { message: '<' },
        controller: MainSidebarController
    })
    .name;