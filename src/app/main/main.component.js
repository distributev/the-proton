import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

    awesomeThings = [];

    /*@ngInject*/
    constructor($http) {
        this.$http = $http;
    }

    $onInit() {}

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
}

export default angular.module('theProtonApp.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.html'),
        controller: MainController
    })
    .name;