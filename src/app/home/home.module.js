import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { HomeComponent } from './home.component';
// import './home.less';

export default angular
    .module('theProtonApp.home', [
        uiRouter
    ])
    .component('home', HomeComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.home', {
                url: 'home',
                component: 'home'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;