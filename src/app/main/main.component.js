import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

    awesomeThings = [];

    /*@ngInject*/
    constructor($http, SkinService) {
        this.$http = $http;
        this.skinService = SkinService;
    }

    $onInit() {
        this.skin = this.skinService.getSkin();
    }

    $onChanges() {
        this.onLayoutChange();
    }

    onLayoutChange() {
        $(function() {
            $.AdminLTE.layout.fix();
            $.AdminLTE.layout.activate();
            $.AdminLTE.controlSidebar.activate();
        });
    }

    changeSkin({ skin }) {
        this.skin = skin;
    }
}

export default angular.module('theProtonApp.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.html'),
        controller: MainController
    })
    .name;