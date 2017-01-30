import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ProcessingQualityComponent } from './processing-quality.component';
// import './processing-quality.less';

export default angular
    .module('theProtonApp.processingQuality', [
        uiRouter
    ])
    .component('processingQuality', ProcessingQualityComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.processing.quality', {
                url: '/processing-quality',
                component: 'processingQuality'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;