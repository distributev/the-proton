import electron from 'electron';

export class MainSidebarController {
    /*@ngInject*/
    constructor() {

    }

    quit() {
        electron.remote.getCurrentWindow().close();
    }
}

export const MainSidebarComponent = {
    template: require('./main-sidebar.html'),
    bindings: {},
    controller: MainSidebarController
};