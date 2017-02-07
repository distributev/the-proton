import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { AboutComponent } from './about.component';
// import './about.less';

export default angular
    .module('theProtonApp.about', [
        uiRouter
    ])
    .component('about', AboutComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.about', {
                url: 'about',
                component: 'about'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;