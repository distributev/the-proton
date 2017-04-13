import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { LoggingTracingComponent } from './logging-tracing.component';
// import './logging-tracing.less';

export default angular
    .module('theProtonApp.loggingTracing', [
        uiRouter
    ])
    .component('loggingTracing', LoggingTracingComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.loggingTracing', {
                url: 'logging-tracing',
                component: 'loggingTracing',
                resolve: {
                    logs: LoggerService => {
                        'ngInject'
                        return LoggerService.getLogs();
                    }
                }
            })
            .state('main.processing.doAction.loggingTracing', {
                url: 'logging-tracing',
                component: 'loggingTracing',
                resolve: {
                    logs: LoggerService => {
                        'ngInject'
                        return LoggerService.getLogs();
                    }
                }
            })
            .state('main.processing.quality.loggingTracing', {
                url: 'logging-tracing',
                component: 'loggingTracing',
                resolve: {
                    logs: LoggerService => {
                        'ngInject'
                        return LoggerService.getLogs();
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;
