import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { LoggingTracingComponent } from './logging-tracing.component';
import { Logging as LoggingService } from './logging.service';
// import './logging-tracing.less';

export default angular
    .module('theProtonApp.loggingTracing', [
        uiRouter
    ])
    .component('loggingTracing', LoggingTracingComponent)
    .service('LoggingService', LoggingService)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.loggingTracing', {
                url: 'logging-tracing',
                component: 'loggingTracing'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;