import angular from 'angular';
import electron from 'electron';

export class MainSidebarController {
    /*@ngInject*/
    constructor() {
        this.message = 'World';
    }

    quit() {
        electron.remote.getCurrentWindow().close();
    }
}

export default angular.module('theProtonApp.main-sidebar', [])
    .component('mainSidebar', {
        template: require('./main-sidebar.html'),
        bindings: { message: '<' },
        controller: MainSidebarController
    })
    .name;