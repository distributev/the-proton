import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationAdvancedComponent } from './configuration-advanced.component';
// import './configuration-advanced.less';

export default angular
    .module('theProtonApp.configurationAdvanced', [
        uiRouter
    ])
    .component('configurationAdvanced', ConfigurationAdvancedComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.advanced', {
                url: '/advanced',
                component: 'configurationAdvanced'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;