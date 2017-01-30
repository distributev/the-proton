import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ProcessingDoActionComponent } from './processing-do-action.component';
// import './processing-do-action.less';

export default angular
    .module('theProtonApp.processingDoAction', [
        uiRouter
    ])
    .component('processingDoAction', ProcessingDoActionComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.processing.doAction', {
                url: '/processing-do-action',
                component: 'processingDoAction'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;