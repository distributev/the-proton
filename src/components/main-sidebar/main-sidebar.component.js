import electron from 'electron';

export class MainSidebarController {
    /*@ngInject*/
    constructor() {

    }

    $onInit() {}

    $onChanges(changes) {
        if (changes.activeSection) {
            this.activeSection = angular.copy(changes.activeSection.currentValue);
        }
    }

    quit() {
        electron.remote.getCurrentWindow().close();
    }
}

export const MainSidebarComponent = {
    template: require('./main-sidebar.html'),
    bindings: {
        activeSection: '<'
    },
    controller: MainSidebarController
};