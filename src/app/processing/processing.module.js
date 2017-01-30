import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ProcessingComponent } from './processing.component';
import processingDoAction from './processing-do-action/processing-do-action.module';
import processingQuality from './processing-quality/processing-quality.module';
// import './processing.less';

export default angular
    .module('theProtonApp.processing', [
        uiRouter,
        processingDoAction,
        processingQuality
    ])
    .component('processing', ProcessingComponent)
    //   .service('ProcessingService', ProcessingService)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.processing', {
                url: 'processing',
                redirectTo: 'main.processing.doAction',
                component: 'processing'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;